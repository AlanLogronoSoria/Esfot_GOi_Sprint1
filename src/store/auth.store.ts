import { create } from 'zustand';
import type { User } from '@/core/types';
import { AuthService } from '@/features/auth/services/auth.service';
import type { LoginInput, RegisterInput, UpdateProfileInput } from '@/features/auth/domain/auth.schema';
import { TokenCleanupService } from '@/core/auth/token-cleanup';
import { isDevMode } from '@/core/config/env';
import { MockSupabaseAuth } from '@/core/dev/mock-services';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  isSessionValid: boolean;
  isRefreshing: boolean;

  registrationEmail: string | null;
  registrationStep: 'form' | 'verification' | 'complete';
  registrationError: string | null;

  gpsPermissionGranted: boolean;
  gpsPermissionDenied: boolean;

  initialize: () => Promise<void>;
  signIn: (input: LoginInput, rememberMe?: boolean) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<{ emailConfirmationRequired: boolean }>;
  signOut: () => Promise<void>;
  secureLogout: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  validateCurrentSession: () => Promise<boolean>;

  resendVerificationEmail: () => Promise<void>;
  setRegistrationEmail: (email: string) => void;
  setRegistrationStep: (step: 'form' | 'verification' | 'complete') => void;
  setRegistrationError: (error: string | null) => void;
  resetRegistration: () => void;

  setGpsPermission: (granted: boolean) => void;

  setSession: (user: User | null, token: string | null) => void;
}

const authService = AuthService.getInstance();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  isSessionValid: false,
  isRefreshing: false,

  registrationEmail: null,
  registrationStep: 'form',
  registrationError: null,

  gpsPermissionGranted: false,
  gpsPermissionDenied: false,

  setSession: (user: User | null, token: string | null) => {
    set({ user, token, isSessionValid: !!user && !!token });
  },

  initialize: async () => {
    try {
      set({ isLoading: true });

      if (isDevMode()) {
        set({ isLoading: false, isInitialized: true });
        return;
      }

      let initUser: User | null = null;
      let initToken: string | null = null;

      await authService.restoreSession.execute(
        (user, token) => {
          initUser = user;
          initToken = token;
        },
        () => {
          // No session found
        }
      );

      if (initUser && initToken) {
        set({ user: initUser, token: initToken, isSessionValid: true });
      }

      const unsubscribe = authService
        .getRepository()
        .subscribeToAuthChanges((session) => {
          if (session) {
            set({ user: session.user, token: session.token, isSessionValid: true });
          } else {
            set({ user: null, token: null, isSessionValid: false });
          }
        });

      (window as unknown as Record<string, unknown>).__authUnsubscribe = unsubscribe;
    } catch {
      set({ user: null, token: null, isSessionValid: false });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  signIn: async (input: LoginInput, rememberMe: boolean = false) => {
    set({ isLoading: true });
    try {
      if (isDevMode()) {
        const result = await MockSupabaseAuth.signIn(input.email, input.password);
        set({ user: result.user, token: result.token, isSessionValid: true });
        return;
      }

      const result = await authService.signIn.execute(input);
      set({ user: result.user, token: result.token, isSessionValid: true });
      await authService.persistSession.execute(rememberMe);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (input: RegisterInput) => {
    set({ isLoading: true, registrationError: null });
    try {
      const result = await authService.registerUser.execute({
        email: input.email.toLowerCase().trim(),
        password: input.password,
        confirmPassword: input.confirmPassword,
        fullName: input.fullName,
        acceptTerms: true,
      });

      if (result.emailConfirmationRequired) {
        set({
          registrationEmail: input.email.toLowerCase().trim(),
          registrationStep: 'verification',
        });
      } else {
        set({ registrationStep: 'complete' });
      }

      return { emailConfirmationRequired: result.emailConfirmationRequired };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al crear la cuenta';
      set({ registrationError: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut.execute();
    } catch {
      // Continue cleanup
    } finally {
      set({
        user: null,
        token: null,
        isSessionValid: false,
        registrationStep: 'form',
        registrationEmail: null,
        isLoading: false,
      });
    }
  },

  secureLogout: async () => {
    set({ isLoading: true });
    try {
      await authService.secureLogout.execute();
    } catch {
      // Force local cleanup
      await TokenCleanupService.performSecureLogout();
    } finally {
      set({
        user: null,
        token: null,
        isSessionValid: false,
        registrationStep: 'form',
        registrationEmail: null,
        gpsPermissionGranted: false,
        gpsPermissionDenied: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (input: UpdateProfileInput) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error('No autenticado');

    set({ isLoading: true });
    try {
      const updated = await authService.updateProfile.execute(currentUser.id, input);
      set({ user: updated });
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ isLoading: true });
    try {
      await authService.changePassword.execute(currentPassword, newPassword);
    } finally {
      set({ isLoading: false });
    }
  },

  recoverPassword: async (email: string) => {
    set({ isLoading: true });
    try {
      await authService.recoverPassword.execute(email);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshToken: async () => {
    set({ isRefreshing: true });
    try {
      const session = await authService.refreshSession.execute();
      if (session) {
        set({ user: session.user, token: session.token, isSessionValid: true });
        return true;
      }
      set({ user: null, token: null, isSessionValid: false });
      return false;
    } catch {
      set({ user: null, token: null, isSessionValid: false });
      return false;
    } finally {
      set({ isRefreshing: false });
    }
  },

  validateCurrentSession: async () => {
    try {
      const session = await authService.validateSession.execute();
      if (session) {
        set({ user: session.user, token: session.token, isSessionValid: true });
        return true;
      }
      set({ user: null, token: null, isSessionValid: false });
      return false;
    } catch {
      return false;
    }
  },

  resendVerificationEmail: async () => {
    const email = get().registrationEmail;
    if (!email) {
      set({ registrationError: 'No hay un correo pendiente de verificación' });
      return;
    }

    set({ isLoading: true, registrationError: null });
    try {
      await authService.resendVerification.execute(email);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al reenviar el correo';
      set({ registrationError: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setRegistrationEmail: (email: string) => set({ registrationEmail: email }),

  setRegistrationStep: (step: 'form' | 'verification' | 'complete') =>
    set({ registrationStep: step }),

  setRegistrationError: (error: string | null) => set({ registrationError: error }),

  resetRegistration: () =>
    set({
      registrationEmail: null,
      registrationStep: 'form',
      registrationError: null,
    }),

  setGpsPermission: (granted: boolean) =>
    set({
      gpsPermissionGranted: granted,
      gpsPermissionDenied: !granted,
    }),
}));
