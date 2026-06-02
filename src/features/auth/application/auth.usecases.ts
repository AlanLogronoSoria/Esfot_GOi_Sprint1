import { IAuthRepository, RegistrationResult } from '../domain/auth.repository';
import type { LoginInput, RegisterInput, UpdateProfileInput } from '../domain/auth.schema';
import type { User } from '@/core/types';
import { AppError } from '@/core/errors/app-error';

export class SignInUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: LoginInput): Promise<{ user: User; token: string }> {
    const normalizedEmail = input.email.toLowerCase().trim();
    if (!normalizedEmail.endsWith('@epn.edu.ec')) {
      throw new AppError('Solo se permiten correos institucionales (@epn.edu.ec)', 'INVALID_DOMAIN');
    }

    return this.authRepository.signIn({ ...input, email: normalizedEmail });
  }
}

export class SignUpUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: RegisterInput): Promise<RegistrationResult> {
    return this.authRepository.signUp(input);
  }
}

export class SignOutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}

export class GetSessionUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<{ user: User; token: string } | null> {
    return this.authRepository.getSession();
  }
}

export class UpdateProfileUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(userId: string, input: UpdateProfileInput): Promise<User> {
    return this.authRepository.updateProfile(userId, input);
  }
}

export class ChangePasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(currentPassword: string, newPassword: string): Promise<void> {
    return this.authRepository.changePassword(currentPassword, newPassword);
  }
}

export class RecoverPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string): Promise<void> {
    return this.authRepository.recoverPassword(email);
  }
}
