import { SupabaseAuthRepository } from '../infrastructure/supabase-auth.repository';
import {
  SignInUseCase,
  SignUpUseCase,
  SignOutUseCase,
  GetSessionUseCase,
  UpdateProfileUseCase,
  ChangePasswordUseCase,
  RecoverPasswordUseCase,
} from '../application/auth.usecases';
import {
  RegisterUserUseCase,
  ResendVerificationUseCase,
  CheckVerificationUseCase,
} from '../application/registration.usecase';
import {
  ValidateSessionUseCase,
  RefreshSessionUseCase,
  SecureLogoutUseCase,
  RestoreSessionUseCase,
  PersistSessionUseCase,
} from '../application/session.usecase';
import type { IAuthRepository } from '../domain/auth.repository';

export class AuthService {
  private static instance: AuthService;
  private repository: IAuthRepository;

  readonly signIn: SignInUseCase;
  readonly signUp: SignUpUseCase;
  readonly signOut: SignOutUseCase;
  readonly getSession: GetSessionUseCase;
  readonly updateProfile: UpdateProfileUseCase;
  readonly changePassword: ChangePasswordUseCase;
  readonly recoverPassword: RecoverPasswordUseCase;

  readonly registerUser: RegisterUserUseCase;
  readonly resendVerification: ResendVerificationUseCase;
  readonly checkVerification: CheckVerificationUseCase;

  readonly validateSession: ValidateSessionUseCase;
  readonly refreshSession: RefreshSessionUseCase;
  readonly secureLogout: SecureLogoutUseCase;
  readonly restoreSession: RestoreSessionUseCase;
  readonly persistSession: PersistSessionUseCase;

  private constructor() {
    this.repository = new SupabaseAuthRepository();

    this.signIn = new SignInUseCase(this.repository);
    this.signUp = new SignUpUseCase(this.repository);
    this.signOut = new SignOutUseCase(this.repository);
    this.getSession = new GetSessionUseCase(this.repository);
    this.updateProfile = new UpdateProfileUseCase(this.repository);
    this.changePassword = new ChangePasswordUseCase(this.repository);
    this.recoverPassword = new RecoverPasswordUseCase(this.repository);

    this.registerUser = new RegisterUserUseCase(this.repository);
    this.resendVerification = new ResendVerificationUseCase(this.repository);
    this.checkVerification = new CheckVerificationUseCase(this.repository);

    this.validateSession = new ValidateSessionUseCase(this.repository);
    this.refreshSession = new RefreshSessionUseCase(this.repository);
    this.secureLogout = new SecureLogoutUseCase(this.repository);
    this.restoreSession = new RestoreSessionUseCase(this.repository);
    this.persistSession = new PersistSessionUseCase();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  getRepository(): IAuthRepository {
    return this.repository;
  }
}
