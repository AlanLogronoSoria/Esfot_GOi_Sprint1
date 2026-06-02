import {
  Shadows,
  Sizes,
  LightTheme as T,
  Typography,
} from "@/constants/design-system";
import { GuestGuard } from "@/core/guards/auth.guard";
import { LoginForm } from "@/features/auth/presentation/login-form";
import { Link } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LoginScreen() {
  return (
    <GuestGuard>
      <View style={s.root}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={s.keyboard}
        >
          <ScrollView
            contentContainerStyle={s.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={s.brand}>
              <View style={s.logoRing}>
                <View style={s.logoInner}>
                  <Text style={s.logoText}>EPN</Text>
                </View>
              </View>
              <Text style={s.appName}>ESFOT Go</Text>
              <Text style={s.tagline}>
                Tu guia inteligente para navegar el campus de la Politecnica
              </Text>
            </View>

            <View style={s.formCard}>
              <LoginForm />
            </View>

            <View style={s.footer}>
              <Link href="/auth/register" style={s.linkPrimary}>
                Crear cuenta institucional
              </Link>
              <Link href="/auth/recover" style={s.linkSecondary}>
                Olvidaste tu contrasena?
              </Link>
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
  container: {
    flexGrow: 1,
    paddingHorizontal: Sizes.paddingXl,
    paddingTop: 80,
    paddingBottom: 40,
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  brand: { alignItems: "center", marginBottom: 32, gap: 10 },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: T.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.glow,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
  },
  appName: {
    ...Typography.h2,
    color: T.textPrimary,
    fontSize: 30,
  },
  tagline: {
    ...Typography.body,
    color: T.textSecondary,
    textAlign: "center",
    maxWidth: 280,
  },
  formCard: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    borderWidth: 1,
    borderColor: T.cardBorder,
    padding: Sizes.paddingLg,
    ...Shadows.sm,
  },
  footer: { marginTop: 24, alignItems: "center", gap: 14 },
  linkPrimary: {
    color: T.primary,
    fontSize: 14,
    fontWeight: "700",
    backgroundColor: T.primaryMuted,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Sizes.radiusSm,
    overflow: "hidden",
  },
  linkSecondary: {
    color: T.textSecondary,
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
