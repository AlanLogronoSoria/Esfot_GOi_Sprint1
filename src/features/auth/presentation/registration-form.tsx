import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  Easing,
} from 'react-native-reanimated';
import {
  step1EmailSchema,
  step2PasswordSchema,
  step3ProfileSchema,
  getPasswordStrength,
} from '@/features/auth/domain/auth.schema';
import type {
  Step1EmailInput,
  Step2PasswordInput,
  Step3ProfileInput,
  PasswordStrength,
} from '@/features/auth/domain/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'expo-router';
import { AppError } from '@/core/errors/app-error';

type Step = 1 | 2 | 3;

const STEP_TITLES: Record<Step, string> = {
  1: 'Tu correo institucional',
  2: 'Crea una contraseña segura',
  3: 'Completa tu perfil',
};

const STEP_SUBTITLES: Record<Step, string> = {
  1: 'Ingresa tu correo de la Escuela Politécnica Nacional',
  2: 'Elige una contraseña fuerte para proteger tu cuenta',
  3: 'Cuéntanos quién eres',
};

const TOTAL_STEPS = 3;

export function RegistrationForm() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const setRegistrationEmail = useAuthStore((s) => s.setRegistrationEmail);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [step, setStep] = useState<Step>(1);
  const [serverError, setServerError] = useState<string | null>(null);

  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const progressWidth = useSharedValue(0);
  const stepOpacity = useSharedValue(1);

  const updateProgress = useCallback(
    (newStep: Step) => {
      progressWidth.value = withTiming((newStep / TOTAL_STEPS) * 100, {
        duration: 400,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    },
    [progressWidth]
  );

  useEffect(() => {
    updateProgress(step);
  }, [step, updateProgress]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const goNext = useCallback(() => {
    if (step < 3) {
      stepOpacity.value = withSequence(
        withTiming(0, { duration: 150 }),
        withTiming(1, { duration: 300 })
      );
      setStep((s) => (s + 1) as Step);
    }
  }, [step, stepOpacity]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setServerError(null);
      setStep((s) => (s - 1) as Step);
    }
  }, [step]);

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, progressBarStyle]} />
      </View>
      <View style={styles.stepIndicator}>
        {([1, 2, 3] as Step[]).map((s) => (
          <View
            key={s}
            style={[
              styles.stepDot,
              s === step && styles.stepDotActive,
              s < step && styles.stepDotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Step header */}
      <Animated.View
        key={`header-${step}`}
        entering={SlideInRight.duration(300).easing(Easing.bezier(0.4, 0, 0.2, 1))}
        exiting={SlideOutLeft.duration(200)}
        style={styles.stepHeader}
      >
        <Text style={styles.stepTitle}>{STEP_TITLES[step]}</Text>
        <Text style={styles.stepSubtitle}>{STEP_SUBTITLES[step]}</Text>
      </Animated.View>

      {/* Server error */}
      {serverError && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{serverError}</Text>
        </Animated.View>
      )}

      {/* Step content */}
      <Animated.View
        key={`content-${step}`}
        entering={SlideInRight.duration(350).easing(Easing.bezier(0.4, 0, 0.2, 1))}
        exiting={SlideOutLeft.duration(200)}
        style={styles.stepContent}
      >
        {step === 1 && (
          <Step1Email
            defaultValue={emailValue}
            onValid={(email) => {
              setEmailValue(email);
              goNext();
            }}
          />
        )}
        {step === 2 && (
          <Step2Password
            defaultValue={passwordValue}
            onValid={(password) => {
              setPasswordValue(password);
              goNext();
            }}
            onBack={goBack}
          />
        )}
        {step === 3 && (
          <Step3Profile
            isLoading={isLoading}
            onSubmit={async (data) => {
              setServerError(null);
              try {
                await signUp({
                  email: emailValue,
                  password: passwordValue,
                  confirmPassword: passwordValue,
                  fullName: data.fullName,
                  acceptTerms: true,
                });
                setRegistrationEmail(emailValue);
                router.replace('/auth/verify');
              } catch (error) {
                if (error instanceof AppError) {
                  setServerError(error.toUserMessage());
                } else {
                  setServerError('Error al crear la cuenta. Intenta de nuevo.');
                }
              }
            }}
            onBack={goBack}
          />
        )}
      </Animated.View>
    </View>
  );
}

// ─── Step 1: Email ───

function Step1Email({
  defaultValue,
  onValid,
}: {
  defaultValue: string;
  onValid: (email: string) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Step1EmailInput>({
    resolver: zodResolver(step1EmailSchema),
    defaultValues: { email: defaultValue },
    mode: 'onChange',
  });

  const email = watch('email');

  return (
    <View style={styles.stepForm}>
      <View style={styles.field}>
        <Text style={styles.label}>Correo electrónico</Text>
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
              autoFocus
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

      <View style={styles.domainBadge}>
        <Text style={styles.domainBadgeText}>@epn.edu.ec</Text>
        <Text style={styles.domainBadgeHint}>Solo correos institucionales</Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, (!email || errors.email) && styles.buttonDisabled]}
        onPress={handleSubmit((data) => onValid(data.email))}
        disabled={!email || !!errors.email}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Step 2: Password ───

function Step2Password({
  defaultValue,
  onValid,
  onBack,
}: {
  defaultValue: string;
  onValid: (password: string) => void;
  onBack: () => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Step2PasswordInput>({
    resolver: zodResolver(step2PasswordSchema),
    defaultValues: { password: defaultValue, confirmPassword: '' },
    mode: 'onChange',
  });

  const password = watch('password');
  const strength: PasswordStrength | null = password ? getPasswordStrength(password) : null;

  return (
    <View style={styles.stepForm}>
      {/* Password strength meter */}
      {strength && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.strengthContainer}>
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
          <View style={styles.checksGrid}>
            {strength.checks.map((check) => (
              <View key={check.label} style={styles.checkRow}>
                <View
                  style={[
                    styles.checkDot,
                    check.passed ? styles.checkDotPassed : styles.checkDotFailed,
                  ]}
                />
                <Text
                  style={[
                    styles.checkLabel,
                    check.passed ? styles.checkLabelPassed : styles.checkLabelFailed,
                  ]}
                >
                  {check.label}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Contraseña</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <RNTextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Crea una contraseña fuerte"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoFocus
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Animated.Text entering={FadeIn} style={styles.errorText}>
            {errors.password.message}
          </Animated.Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirmar contraseña</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <RNTextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Repite tu contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.confirmPassword && (
          <Animated.Text entering={FadeIn} style={styles.errorText}>
            {errors.confirmPassword.message}
          </Animated.Text>
        )}
      </View>

      <View style={styles.stepActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            styles.buttonHalf,
            (errors.password || errors.confirmPassword) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit((data) => onValid(data.password))}
          disabled={!!errors.password || !!errors.confirmPassword}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Step 3: Profile ───

function Step3Profile({
  isLoading,
  onSubmit,
  onBack,
}: {
  isLoading: boolean;
  onSubmit: (data: Step3ProfileInput) => Promise<void>;
  onBack: () => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3ProfileInput>({
    resolver: zodResolver(step3ProfileSchema),
    defaultValues: { fullName: '', acceptTerms: false },
    mode: 'onChange',
  });

  return (
    <View style={styles.stepForm}>
      <View style={styles.field}>
        <Text style={styles.label}>Nombre completo</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <RNTextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="Ej: Juan Pérez"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoFocus
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.fullName && (
          <Animated.Text entering={FadeIn} style={styles.errorText}>
            {errors.fullName.message}
          </Animated.Text>
        )}
      </View>

      {/* Terms checkbox */}
      <Controller
        control={control}
        name="acceptTerms"
        render={({ field: { onChange, value } }) => (
          <Pressable
            style={styles.termsRow}
            onPress={() => onChange(!value)}
          >
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
              {value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text style={styles.termsLink}>Términos y Condiciones</Text> y la{' '}
              <Text style={styles.termsLink}>Política de Privacidad</Text> de la EPN
            </Text>
          </Pressable>
        )}
      />
      {errors.acceptTerms && (
        <Animated.Text entering={FadeIn} style={styles.errorText}>
          {errors.acceptTerms.message}
        </Animated.Text>
      )}

      <View style={styles.stepActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            styles.buttonHalf,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Crear cuenta</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00205B',
    borderRadius: 2,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  stepDotActive: {
    backgroundColor: '#00205B',
    width: 24,
  },
  stepDotCompleted: {
    backgroundColor: '#059669',
  },

  stepHeader: {
    gap: 4,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  stepContent: {
    minHeight: 280,
  },
  stepForm: {
    gap: 20,
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
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 2,
  },

  domainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  domainBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B6BB0',
  },
  domainBadgeHint: {
    fontSize: 12,
    color: '#6B7280',
  },

  strengthContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  strengthBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  checksGrid: {
    gap: 6,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  checkDotPassed: {
    backgroundColor: '#10B981',
  },
  checkDotFailed: {
    backgroundColor: '#D1D5DB',
  },
  checkLabel: {
    fontSize: 12,
  },
  checkLabelPassed: {
    color: '#059669',
  },
  checkLabelFailed: {
    color: '#9CA3AF',
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#00205B',
    borderColor: '#00205B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  termsLink: {
    color: '#1B6BB0',
    fontWeight: '600',
  },

  stepActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#00205B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonHalf: {
    flex: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },

  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorBannerText: {
    color: '#991B1B',
    fontSize: 14,
    lineHeight: 20,
  },
});
