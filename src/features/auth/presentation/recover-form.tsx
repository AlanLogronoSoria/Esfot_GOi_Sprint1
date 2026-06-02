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
import { useState } from 'react';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { recoverPasswordSchema } from '@/features/auth/domain/auth.schema';
import type { RecoverPasswordInput } from '@/features/auth/domain/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { AppError } from '@/core/errors/app-error';

export function RecoverForm() {
  const recoverPassword = useAuthStore((s) => s.recoverPassword);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordInput>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: RecoverPasswordInput) => {
    setServerError(null);
    try {
      await recoverPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      if (error instanceof AppError) {
        setServerError(error.toUserMessage());
      } else {
        setServerError('Error al enviar el correo de recuperación. Intenta de nuevo.');
      }
    }
  };

  if (emailSent) {
    return (
      <Animated.View entering={ZoomIn.duration(400)} style={styles.sentContainer}>
        <View style={styles.sentIcon}>
          <Text style={styles.sentIconText}>✉️</Text>
        </View>
        <Text style={styles.sentTitle}>Correo enviado</Text>
        <Text style={styles.sentDescription}>
          Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu
          contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
        </Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo institucional y te enviaremos un enlace para crear una nueva
        contraseña.
      </Text>

      {serverError && (
        <Animated.View entering={FadeIn} style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{serverError}</Text>
        </Animated.View>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Correo institucional</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <RNTextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="usuario@epn.edu.ec"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={(text) => onChange(text.toLowerCase().trim())}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Animated.Text entering={FadeIn} style={styles.errorText}>
            {errors.email.message}
          </Animated.Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Enviar enlace</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: -12,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorBannerText: {
    color: '#991B1B',
    fontSize: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#00205B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sentContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  sentIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentIconText: {
    fontSize: 36,
  },
  sentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#059669',
  },
  sentDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
});
