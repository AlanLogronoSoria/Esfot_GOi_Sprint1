import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RegistrationForm } from '@/features/auth/presentation/registration-form';
import { GuestGuard } from '@/core/guards/auth.guard';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

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
              <View style={st.logoInner}><Text style={st.logoText}>EPN</Text></View>
              <Text style={st.appName}>EsfotGo</Text>
              <Text style={st.tagline}>Escuela Politécnica Nacional</Text>
            </View>
            <RegistrationForm />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </GuestGuard>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  keyboard: { flex: 1 },
  container: { flexGrow: 1, padding: 20, paddingTop: 40, paddingBottom: 40, maxWidth: 440, width: '100%', alignSelf: 'center', justifyContent: 'center' },
  brand: { alignItems: 'center', marginBottom: 20, gap: 4 },
  logoInner: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: T.primary,
    justifyContent: 'center', alignItems: 'center', ...Shadows.glow,
  },
  logoText: { color: T.text, fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  appName: { fontSize: 24, fontWeight: '800', color: T.textPrimary, letterSpacing: -0.5 },
  tagline: { fontSize: 12, color: T.textSecondary },
});
