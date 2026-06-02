import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { loginSchema } from '@/features/auth/domain/auth.schema';
import type { LoginInput } from '@/features/auth/domain/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'expo-router';
import { AppError } from '@/core/errors/app-error';
import { GlassInput, GlassButton } from '@/shared/components/premium';
import { DarkTheme as T, Sizes } from '@/constants/design-system';

const ERROR_MAP: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos',
  EMAIL_NOT_CONFIRMED: 'Confirma tu correo electrónico primero',
  RATE_LIMITED: 'Demasiados intentos. Espera un momento.',
  USER_NOT_FOUND: 'No existe cuenta con este correo',
  DEFAULT: 'Error al iniciar sesión',
};

function mapError(e: unknown): string {
  if (e instanceof AppError) return ERROR_MAP[e.code] ?? e.toUserMessage();
  const m = (e as any)?.message ?? '';
  if (m.includes('Invalid login')) return ERROR_MAP.INVALID_CREDENTIALS;
  if (m.includes('not confirmed')) return ERROR_MAP.EMAIL_NOT_CONFIRMED;
  if (m.includes('rate') || m.includes('too many')) return ERROR_MAP.RATE_LIMITED;
  return ERROR_MAP.DEFAULT;
}

export function LoginForm() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const loading = useAuthStore((s) => s.isLoading);
  const [err, setErr] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(async (d: LoginInput) => {
    setErr(null);
    try {
      await signIn(d, remember);
      router.replace({ pathname: '/(drawer)', params: { showGpsPrompt: '1' } });
    } catch (e) { setErr(mapError(e)); }
  }, [signIn, remember, router]);

  return (
    <View style={s.root}>
      {err && (
        <Animated.View entering={FadeIn} style={s.errBanner}>
          <Text style={s.errText}>{err}</Text>
        </Animated.View>
      )}

      <Controller control={control} name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <GlassInput
            icon="✉️"
            placeholder="usuario@epn.edu.ec"
            value={value}
            onChangeText={(t: string) => onChange(t.toLowerCase().trim())}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onBlur={onBlur}
            error={errors.email?.message}
          />
        )}
      />
      {errors.email && <Text style={s.fieldErr}>{errors.email.message}</Text>}

      <Controller control={control} name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <GlassInput
            icon="🔒"
            placeholder="Contraseña"
            value={value}
            onChangeText={onChange}
            secureTextEntry={!showPw}
            onBlur={onBlur}
            error={errors.password?.message}
            rightElement={
              <TouchableOpacity onPress={() => setShowPw(!showPw)} hitSlop={8}>
                <Text style={{ fontSize: 18 }}>{showPw ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            }
          />
        )}
      />
      {errors.password && <Text style={s.fieldErr}>{errors.password.message}</Text>}

      <Pressable style={s.remember} onPress={() => setRemember(!remember)}>
        <View style={[s.check, remember && s.checkOn]}>
          {remember && <Text style={s.checkMark}>✓</Text>}
        </View>
        <Text style={s.rememberText}>Mantener sesión iniciada</Text>
      </Pressable>

      <GlassButton title="Iniciar sesión" onPress={handleSubmit(onSubmit)} loading={loading} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { gap: 16 },
  errBanner: {
    backgroundColor: T.errorBg, borderRadius: Sizes.radiusSm,
    padding: 14, borderLeftWidth: 3, borderLeftColor: T.error,
  },
  errText: { color: T.error, fontSize: 13 },
  fieldErr: { color: T.error, fontSize: 11, marginTop: -12 },
  remember: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  check: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 1.5,
    borderColor: T.inputBorder, justifyContent: 'center', alignItems: 'center',
  },
  checkOn: { backgroundColor: T.primary, borderColor: T.primary },
  checkMark: { color: T.text, fontSize: 12, fontWeight: '700' },
  rememberText: { fontSize: 13, color: T.textSecondary },
});
