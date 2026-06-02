import type { User } from '@/core/types';
import type { LoginInput, RegisterInput, UpdateProfileInput } from './auth.schema';

export interface RegistrationResult {
  user: User;
  emailConfirmationRequired: boolean;
}

export interface IAuthRepository {
  signIn(input: LoginInput): Promise<{ user: User; token: string }>;
  signUp(input: RegisterInput): Promise<RegistrationResult>;
  resendVerificationEmail(email: string): Promise<void>;
  checkEmailVerification(email: string): Promise<boolean>;
  signOut(): Promise<void>;
  getSession(): Promise<{ user: User; token: string } | null>;
  updateProfile(userId: string, input: UpdateProfileInput): Promise<User>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  recoverPassword(email: string): Promise<void>;
  refreshSession(): Promise<{ user: User; token: string } | null>;
  subscribeToAuthChanges(callback: (session: { user: User; token: string } | null) => void): () => void;
}
