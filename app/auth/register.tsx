import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RegistrationForm } from '@/features/auth/presentation/registration-form';
import { GuestGuard } from '@/core/guards/auth.guard';
import { LightTheme as T, Shadows, Sizes, Typography } from '@/constants/design-system';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const BENEFITS = [
  { icon: '🗺️', text: 'Navega el campus fácilmente' },
  { icon: '📅', text: 'Consulta eventos institucionales' },
  { icon: '🚌', text: 'Sigue el Polibus en tiempo real' },
];

export default function RegisterScreen() {
  return (
    <GuestGuard>
      <View style={st.root}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={st.keyboard}
        >
          <ScrollView
            contentContainerStyle={st.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Top gradient decoration */}
            <LinearGradient
              colors={['#042c5c', '#0a4488', 'transparent']}
              style={st.topGradient}
            />

            {/* Brand */}
            <Animated.View entering={FadeIn.duration(500)} style={st.brand}>
              <View style={st.iconCircle}>
                <Text style={st.iconText}>🎓</Text>
                <View style={st.iconAccent} />
              </View>
              <Text style={st.title}>Crear cuenta</Text>
              <Text style={st.tagline}>
                Únete a la comunidad académica y explora el campus con precisión.
              </Text>
            </Animated.View>

            {/* Benefits */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={st.benefitsRow}>
              {BENEFITS.map((b, i) => (
                <View key={i} style={st.benefit}>
                  <Text style={st.benefitIcon}>{b.icon}</Text>
                  <Text style={st.benefitText}>{b.text}</Text>
                </View>
              ))}
            </Animated.View>

            {/* Form card */}
            <Animated.View entering={FadeInDown.delay(180).duration(500)} style={st.formCard}>
              <View style={st.formHeader}>
                <Text style={st.formTitle}>Tus datos</Text>
                <Text style={st.formSubtitle}>Usa tu correo institucional @epn.edu.ec</Text>
              </View>
              <RegistrationForm />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </GuestGuard>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  keyboard: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: Sizes.paddingXl,
    paddingTop: 60,
    paddingBottom: 48,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },

  topGradient: {
    position: 'absolute',
    top: 0,
    left: -Sizes.paddingXl,
    right: -Sizes.paddingXl,
    height: 180,
    opacity: 0.12,
  },

  brand: { alignItems: 'center', marginBottom: 20, gap: 10 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  iconText: { fontSize: 36 },
  iconAccent: {
    position: 'absolute',
    bottom: 4,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: T.highlight,
    borderWidth: 2.5,
    borderColor: T.background,
  },
  title: {
    ...Typography.h2,
    color: T.textPrimary,
    fontSize: 28,
  },
  tagline: {
    ...Typography.bodySm,
    color: T.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },

  // Benefits
  benefitsRow: {
    backgroundColor: T.primaryMuted,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingMd,
    gap: 10,
    marginBottom: Sizes.gapMd,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitIcon: { fontSize: 16 },
  benefitText: {
    ...Typography.bodySm,
    color: T.primary,
    fontWeight: '500',
  },

  // Form
  formCard: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusXl,
    borderWidth: 1,
    borderColor: T.cardBorder,
    padding: Sizes.paddingLg,
    gap: Sizes.gapMd,
    ...Shadows.md,
  },
  formHeader: { gap: 4, marginBottom: 4 },
  formTitle: { ...Typography.h3, color: T.textPrimary },
  formSubtitle: { ...Typography.bodySm, color: T.textSecondary },
});
