import { supabase } from '@/core/config/supabase';
import { AuthError, mapSupabaseError } from '@/core/errors/app-error';
import type { User } from '@/core/types';
import type { IAuthRepository, RegistrationResult } from '../domain/auth.repository';
import type { LoginInput, RegisterInput, UpdateProfileInput } from '../domain/auth.schema';

export class SupabaseAuthRepository implements IAuthRepository {
  async signIn(input: LoginInput): Promise<{ user: User; token: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email.toLowerCase().trim(),
      password: input.password,
    });

    if (error) {
      if (error.message?.includes('Email not confirmed')) {
        throw new AuthError(
          'Debes confirmar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.',
          'EMAIL_NOT_CONFIRMED'
        );
      }
      throw mapSupabaseError(error);
    }

    if (!data.session) throw new AuthError('No se pudo iniciar sesión');

    const profile = await this.fetchProfile(data.session.user.id);

    return {
      user: profile,
      token: data.session.access_token,
    };
  }

  async signUp(input: RegisterInput): Promise<RegistrationResult> {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.toLowerCase().trim(),
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
        },
        emailRedirectTo: 'esfotgo://auth/verified',
      },
    });

    if (error) {
      if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
        throw new AuthError(
          'Este correo ya está registrado. Intenta iniciar sesión o recuperar tu contraseña.',
          'EMAIL_ALREADY_EXISTS'
        );
      }
      throw mapSupabaseError(error);
    }

    if (!data.user) throw new AuthError('No se pudo crear la cuenta', 'REGISTRATION_FAILED');

    const emailConfirmationRequired = !data.user.email_confirmed_at && !data.session;

    return {
      user: this.mapAuthUserToUser(data.user),
      emailConfirmationRequired,
    };
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: 'esfotgo://auth/verified',
      },
    });

    if (error) {
      if (error.message?.includes('rate_limit') || error.message?.includes('too many')) {
        throw new AuthError(
          'Has solicitado demasiados reenvíos. Espera 60 segundos e inténtalo de nuevo.',
          'RATE_LIMITED'
        );
      }
      throw mapSupabaseError(error);
    }
  }

  async checkEmailVerification(email: string): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) return true;

      return false;
    } catch {
      return false;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw mapSupabaseError(error);
  }

  async getSession(): Promise<{ user: User; token: string } | null> {
    const { data } = await supabase.auth.getSession();

    if (!data.session) return null;

    const profile = await this.fetchProfile(data.session.user.id);

    return {
      user: profile,
      token: data.session.access_token,
    };
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    const updates: Record<string, unknown> = {};

    if (input.fullName !== undefined) updates.full_name = input.fullName;
    if (input.phone !== undefined) updates.phone = input.phone || null;
    if (input.avatarUrl !== undefined) updates.avatar_url = input.avatarUrl;

    const { error, data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw mapSupabaseError(error);

    return this.mapProfileToUser(data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const { error } = await supabase.rpc('change_user_password', {
      current_plain_password: currentPassword,
      new_plain_password: newPassword,
    });

    if (error) throw mapSupabaseError(error);
  }

  async recoverPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
      redirectTo: 'esfotgo://auth/callback',
    });

    if (error) throw mapSupabaseError(error);
  }

  async refreshSession(): Promise<{ user: User; token: string } | null> {
    const { data } = await supabase.auth.refreshSession();

    if (!data.session) return null;

    const profile = await this.fetchProfile(data.session.user.id);

    return {
      user: profile,
      token: data.session.access_token,
    };
  }

  subscribeToAuthChanges(
    callback: (session: { user: User; token: string } | null) => void
  ): () => void {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session) {
          const profile = await this.fetchProfile(session.user.id);
          callback({ user: profile, token: session.access_token });
        }
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });

    return data.subscription.unsubscribe;
  }

  private async fetchProfile(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw mapSupabaseError(error);

    return this.mapProfileToUser(data);
  }

  private mapAuthUserToUser(authUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }): User {
    return {
      id: authUser.id,
      email: authUser.email ?? '',
      fullName: (authUser.user_metadata?.full_name as string) ?? null,
      role: 'estudiante',
      avatarUrl: null,
      phone: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private mapProfileToUser(profile: Record<string, unknown>): User {
    return {
      id: profile.id as string,
      email: profile.email as string,
      fullName: (profile.full_name as string) ?? null,
      role: (profile.role as User['role']) ?? 'estudiante',
      avatarUrl: (profile.avatar_url as string) ?? null,
      phone: (profile.phone as string) ?? null,
      createdAt: profile.created_at as string,
      updatedAt: profile.updated_at as string,
    };
  }
}
