import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RegistrationForm } from '@/features/auth/presentation/registration-form';
import { GuestGuard } from '@/core/guards/auth.guard';
import { LightTheme as T, Shadows, Sizes } from '@/constants/design-system';

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
            <View style={st.brand}>
              <View style={st.iconCircle}>
                <Text style={st.iconText}>🎓</Text>
              </View>
              <Text style={st.title}>Crea tu cuenta</Text>
              <Text style={st.tagline}>
                Unete a la comunidad academica y explora el campus con precision.
              </Text>
            </View>

            <View style={st.formCard}>
              <RegistrationForm />
            </View>
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  brand: { alignItems: 'center', marginBottom: 28, gap: 8 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: T.accentMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: { fontSize: 36 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: T.textPrimary,
  },
  tagline: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    borderWidth: 1,
    borderColor: T.cardBorder,
    padding: Sizes.paddingLg,
    ...Shadows.sm,
  },
});
