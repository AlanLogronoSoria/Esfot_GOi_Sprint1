export type RegistrationStep = 'email' | 'password' | 'profile' | 'verification' | 'complete';

export type RegistrationStatus = 'pending' | 'email_sent' | 'email_verified' | 'profile_created' | 'failed';

export interface RegistrationState {
  email: string;
  step: RegistrationStep;
  status: RegistrationStatus;
  attempts: number;
  lastAttemptAt: string | null;
  verificationSentAt: string | null;
}

export interface RegistrationError {
  code: string;
  message: string;
  field?: string;
  step?: RegistrationStep;
}

export const REGISTRATION_ERROR_CODES = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_DOMAIN: 'INVALID_DOMAIN',
  RATE_LIMITED: 'RATE_LIMITED',
  VERIFICATION_FAILED: 'VERIFICATION_FAILED',
  PROFILE_CREATION_FAILED: 'PROFILE_CREATION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export const REGISTRATION_ERROR_MESSAGES: Record<string, string> = {
  [REGISTRATION_ERROR_CODES.EMAIL_ALREADY_EXISTS]:
    'Este correo ya está registrado. ¿Olvidaste tu contraseña?',
  [REGISTRATION_ERROR_CODES.WEAK_PASSWORD]:
    'La contraseña no cumple con los requisitos de seguridad',
  [REGISTRATION_ERROR_CODES.INVALID_EMAIL]:
    'El formato del correo no es válido',
  [REGISTRATION_ERROR_CODES.INVALID_DOMAIN]:
    'Solo se permiten correos institucionales @epn.edu.ec',
  [REGISTRATION_ERROR_CODES.RATE_LIMITED]:
    'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
  [REGISTRATION_ERROR_CODES.VERIFICATION_FAILED]:
    'No se pudo enviar el correo de verificación. Inténtalo de nuevo.',
  [REGISTRATION_ERROR_CODES.PROFILE_CREATION_FAILED]:
    'Error al crear el perfil. Contacta al administrador.',
  [REGISTRATION_ERROR_CODES.NETWORK_ERROR]:
    'Error de conexión. Verifica tu internet e intenta de nuevo.',
  [REGISTRATION_ERROR_CODES.UNKNOWN]:
    'Ha ocurrido un error inesperado. Inténtalo de nuevo.',
};
