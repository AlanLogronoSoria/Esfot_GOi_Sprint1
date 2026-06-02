import { z } from 'zod';

const emailBase = z
  .string()
  .min(1, 'El correo es requerido')
  .email('Formato de correo inválido')
  .max(254, 'El correo excede la longitud máxima');

export const institutionalEmailSchema = emailBase
  .regex(/@epn\.edu\.ec$/i, 'Solo se permiten correos institucionales @epn.edu.ec')
  .refine((email) => !email.includes('+'), 'No se permiten alias de correo (no uses +)')
  .refine(
    (email) => {
      const localPart = email.split('@')[0];
      return localPart.length >= 3;
    },
    'La parte local del correo debe tener al menos 3 caracteres'
  );

export const strongPasswordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(128, 'La contraseña no debe exceder 128 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    'Debe contener al menos un carácter especial (!@#$%...)'
  );

export const fullNameSchema = z
  .string()
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .max(100, 'El nombre no debe exceder 100 caracteres')
  .regex(
    /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/,
    'Solo se permiten letras, espacios, apóstrofes y guiones'
  )
  .transform((val) =>
    val
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
  );

export const step1EmailSchema = z.object({
  email: institutionalEmailSchema,
});

export const step2PasswordSchema = z.object({
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
});

export const step3ProfileSchema = z.object({
  fullName: fullNameSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

export const registerSchema = z
  .object({
    email: institutionalEmailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    fullName: fullNameSchema,
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type Step1EmailInput = z.infer<typeof step1EmailSchema>;
export type Step2PasswordInput = z.infer<typeof step2PasswordSchema>;
export type Step3ProfileInput = z.infer<typeof step3ProfileSchema>;

export const loginSchema = z.object({
  email: institutionalEmailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const recoverPasswordSchema = z.object({
  email: institutionalEmailSchema,
});

export type RecoverPasswordInput = z.infer<typeof recoverPasswordSchema>;

export const updateProfileSchema = z.object({
  fullName: fullNameSchema.optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos')
    .optional()
    .or(z.literal('')),
  avatarUrl: z.string().url().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: strongPasswordSchema,
  confirmNewPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: { label: string; passed: boolean }[];
}

export function getPasswordStrength(password: string): PasswordStrength {
  const checks = [
    { label: '8+ caracteres', passed: password.length >= 8 },
    { label: 'Una mayúscula', passed: /[A-Z]/.test(password) },
    { label: 'Una minúscula', passed: /[a-z]/.test(password) },
    { label: 'Un número', passed: /[0-9]/.test(password) },
    { label: 'Un carácter especial', passed: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ];

  const passed = checks.filter((c) => c.passed).length;

  if (passed <= 2) return { score: 1, label: 'Débil', color: '#EF4444', checks };
  if (passed <= 3) return { score: 2, label: 'Regular', color: '#F59E0B', checks };
  if (passed <= 4) return { score: 3, label: 'Buena', color: '#3B82F6', checks };
  return { score: 4, label: 'Fuerte', color: '#10B981', checks };
}
