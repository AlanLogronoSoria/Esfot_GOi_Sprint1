import { View, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { LoginForm } from '@/features/auth/presentation/login-form';
import { GuestGuard } from '@/core/guards/auth.guard';
import { DarkTheme as T, Shadows, Sizes, Typography, EPN_GOLD, EPN_BLUE } from '@/constants/design-system';

export default function LoginScreen() {
  return (
    <GuestGuard>
      <View style={s.root}>
        <View style={s.container}>
          <View style={s.brand}>
            <View style={s.logo}>
              <View style={[s.logoInner, { backgroundColor: EPN_BLUE }]}>
                <Text style={s.logoText}>EPN</Text>
              </View>
              <View style={s.logoGlow} />
            </View>
            <Text style={s.appName}>EsfotGo</Text>
            <View style={s.goldLine} />
            <Text style={s.tagline}>Escuela Politécnica Nacional</Text>
          </View>

          <View style={s.formCard}>
            <LoginForm />
          </View>

          <View style={s.footer}>
            <Link href="/auth/register" style={s.linkPrimary}>
              Crear cuenta institucional
            </Link>
            <Link href="/auth/recover" style={s.linkSecondary}>
              ¿Olvidaste tu contraseña?
            </Link>
          </View>
        </View>
      </View>
    </GuestGuard>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  container: {
    flex: 1, paddingHorizontal: Sizes.paddingXl,
    justifyContent: 'center', maxWidth: 420, width: '100%', alignSelf: 'center',
  },
  brand: { alignItems: 'center', marginBottom: 28, gap: 8 },
  logo: { position: 'relative' },
  logoInner: {
    width: 56, height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', ...Shadows.glow,
  },
  logoText: { color: T.text, fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  logoGlow: {
    position: 'absolute', top: -6, left: -6,
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(0,51,160,0.12)',
  },
  appName: { fontSize: 26, fontWeight: '800', color: T.text, letterSpacing: -0.5 },
  goldLine: { width: 36, height: 3, backgroundColor: EPN_GOLD, borderRadius: 2, marginVertical: 2 },
  tagline: { fontSize: 13, color: T.textSecondary },
  formCard: {
    backgroundColor: T.surfaceGlass, borderRadius: Sizes.radiusLg,
    borderWidth: 1, borderColor: T.cardBorder, padding: Sizes.paddingLg, ...Shadows.lg,
  },
  footer: { marginTop: 20, alignItems: 'center', gap: 14 },
  linkPrimary: {
    color: T.text, fontSize: 13, fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: Sizes.radiusSm, overflow: 'hidden',
  },
  linkSecondary: { color: T.textTertiary, fontSize: 13, textDecorationLine: 'underline' },
});
