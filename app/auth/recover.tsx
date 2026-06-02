import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { RecoverForm } from '@/features/auth/presentation/recover-form';
import { DarkTheme as T, Sizes } from '@/constants/design-system';
import { GuestGuard } from '@/core/guards/auth.guard';

export default function RecoverScreen() {
  return (
    <GuestGuard>
      <View style={s.root}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={s.keyboard}
        >
          <ScrollView
            contentContainerStyle={s.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={s.card}>
              <View style={s.iconCircle}><Text style={s.icon}>🔑</Text></View>
              <RecoverForm />
            </View>
            <View style={s.footer}>
              <Link href="/auth/login" style={s.link}>← Volver al inicio de sesión</Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </GuestGuard>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  keyboard: { flex: 1 },
  container: { flexGrow: 1, padding: Sizes.paddingXl, justifyContent: 'center', maxWidth: 420, width: '100%', alignSelf: 'center', paddingTop: 80, paddingBottom: 40 },
  card: { backgroundColor: T.surfaceGlass, borderRadius: Sizes.radiusLg, padding: Sizes.paddingLg, alignItems: 'center', gap: Sizes.gapLg, borderWidth: 1, borderColor: T.cardBorder },
  iconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: T.infoBg, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 24 },
  footer: { marginTop: Sizes.gapLg, alignItems: 'center' },
  link: { color: T.primary, fontSize: 14, fontWeight: '600' },
});
