import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useState, useCallback } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { changePasswordSchema, getPasswordStrength } from '@/features/auth/domain/auth.schema';
import type { ChangePasswordInput, PasswordStrength } from '@/features/auth/domain/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { useMutation } from '@tanstack/react-query';
import { LightTheme as T, Sizes } from '@/constants/design-system';

export function ChangePasswordForm() {
  const changePasswordAction = useAuthStore((s) => s.changePassword);
  const [collapsed, setCollapsed] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
    mode: 'onChange',
  });

  const newPassword = watch('newPassword');
  const strength: PasswordStrength | null = newPassword ? getPasswordStrength(newPassword) : null;

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordInput) =>
      changePasswordAction(data.currentPassword, data.newPassword),
    onSuccess: () => {
      setSuccessMessage('Contraseña actualizada correctamente');
      reset();
      setTimeout(() => setSuccessMessage(null), 3000);
    },
  });

  const onSubmit = useCallback(
    (data: ChangePasswordInput) => {
      mutation.reset();
      setSuccessMessage(null);
      mutation.mutate(data);
    },
    [mutation]
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setCollapsed(!collapsed)}
        activeOpacity={0.7}
      >
        <Text style={styles.headerText}>Cambiar contraseña</Text>
        <Text style={styles.chevron}>{collapsed ? '›' : '⌄'}</Text>
      </TouchableOpacity>

      {!collapsed && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.form}>
          {mutation.isError && (
            <Animated.View entering={FadeIn} style={styles.errorBanner}>
              <Text style={styles.errorText}>
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : 'Error al cambiar la contraseña'}
              </Text>
            </Animated.View>
          )}

          {successMessage && (
            <Animated.View entering={FadeIn} style={styles.successBanner}>
              <Text style={styles.successText}>{successMessage}</Text>
            </Animated.View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña actual</Text>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <RNTextInput
                  style={[styles.input, errors.currentPassword && styles.inputError]}
                  placeholder="••••••••"
                  placeholderTextColor={T.inputPlaceholder}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.currentPassword && (
              <Text style={styles.fieldError}>{errors.currentPassword.message}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <RNTextInput
                  style={[styles.input, errors.newPassword && styles.inputError]}
                  placeholder="Crea una contraseña fuerte"
                  placeholderTextColor={T.inputPlaceholder}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.newPassword && (
              <Text style={styles.fieldError}>{errors.newPassword.message}</Text>
            )}
          </View>

          {strength && newPassword.length > 0 && (
            <View style={styles.strengthRow}>
              <View style={styles.strengthBarBg}>
                <Animated.View
                  style={[
                    styles.strengthBarFill,
                    {
                      width: `${(strength.score / 4) * 100}%`,
                      backgroundColor: strength.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Confirmar nueva contraseña</Text>
            <Controller
              control={control}
              name="confirmNewPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <RNTextInput
                  style={[styles.input, errors.confirmNewPassword && styles.inputError]}
                  placeholder="Repite tu nueva contraseña"
                  placeholderTextColor={T.inputPlaceholder}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.confirmNewPassword && (
              <Text style={styles.fieldError}>{errors.confirmNewPassword.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, mutation.isPending && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            activeOpacity={0.8}
          >
            {mutation.isPending ? (
              <ActivityIndicator color={T.surface} />
            ) : (
              <Text style={styles.buttonText}>Actualizar contraseña</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.primary,
  },
  chevron: {
    fontSize: 20,
    color: T.textTertiary,
    fontWeight: '600',
  },
  form: {
    gap: 16,
    marginTop: 12,
  },
  errorBanner: {
    backgroundColor: T.errorBg,
    borderRadius: Sizes.radiusSm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: T.error,
  },
  errorText: {
    color: T.error,
    fontSize: 12,
  },
  successBanner: {
    backgroundColor: T.successBg,
    borderRadius: Sizes.radiusSm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: T.success,
  },
  successText: {
    color: T.success,
    fontSize: 12,
    fontWeight: '600',
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: T.inputBg,
    borderWidth: 1.5,
    borderColor: T.cardBorder,
    borderRadius: Sizes.radiusSm,
    padding: 12,
    fontSize: 14,
    color: T.textPrimary,
  },
  inputError: {
    borderColor: T.error,
  },
  fieldError: {
    color: T.error,
    fontSize: 11,
  },
  strengthRow: {
    gap: 6,
  },
  strengthBarBg: {
    height: 4,
    backgroundColor: T.textMuted,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  button: {
    backgroundColor: T.primary,
    borderRadius: Sizes.radiusSm,
    padding: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: T.surface,
    fontSize: 14,
    fontWeight: '700',
  },
});
