import {
  Shadows,
  Sizes,
  LightTheme as T,
  Typography,
} from "@/constants/design-system";
import { GuestGuard } from "@/core/guards/auth.guard";
import { LoginForm } from "@/features/auth/presentation/login-form";
import { Link } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

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
            {/* Header gradient band */}
            <View style={s.gradientWrap}>
              <LinearGradient
                colors={["#042c5c", "#0a4488"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.gradientBand}
              />
              {/* Decorative circle */}
              <View style={s.decorCircle} />
              <View style={s.decorCircle2} />
            </View>

            {/* Brand section */}
            <Animated.View entering={FadeIn.duration(600)} style={s.brand}>
              {/* Logo */}
              <View style={s.logoRing}>
                <View style={s.logoInner}>
                  <Text style={s.logoText}>EPN</Text>
                </View>
                {/* Gold accent dot */}
                <View style={s.accentDot} />
              </View>

              <Text style={s.appName}>
                ESFOT <Text style={s.appNameAccent}>Go</Text>
              </Text>
              <Text style={s.tagline}>
                Tu guía inteligente para navegar el campus de la Politécnica
              </Text>
            </Animated.View>

            {/* Form card */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)} style={s.formCard}>
              <View style={s.formHeader}>
                <Text style={s.formTitle}>Iniciar sesión</Text>
                <Text style={s.formSubtitle}>Usa tu correo institucional</Text>
              </View>
              <LoginForm />
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInDown.delay(350).duration(400)} style={s.footer}>
              <Link href="/auth/register" style={s.linkPrimary}>
                Crear cuenta institucional
              </Link>
              <Link href="/auth/recover" style={s.linkSecondary}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Animated.View>
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
    paddingBottom: 48,
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },

  // Gradient header band
  gradientWrap: {
    position: 'relative',
    height: 0,
  },
  gradientBand: {
    position: 'absolute',
    top: -100,
    left: -Sizes.paddingXl,
    right: -Sizes.paddingXl,
    height: 260,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  decorCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -80,
    right: -60,
  },
  decorCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(235,47,38,0.08)',
    top: -50,
    left: -40,
  },

  // Brand
  brand: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 28,
    gap: 10,
  },
  logoRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'rgba(4,44,92,0.15)',
    backgroundColor: T.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    position: 'relative',
  },
  logoInner: {
    width: 68,
    height: 68,
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
  accentDot: {
    position: 'absolute',
    bottom: 8,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fabb54',
    borderWidth: 3,
    borderColor: T.background,
  },
  appName: {
    ...Typography.h2,
    color: T.textPrimary,
    fontSize: 32,
    letterSpacing: -0.5,
  },
  appNameAccent: {
    color: T.accent,
  },
  tagline: {
    ...Typography.bodySm,
    color: T.textSecondary,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
  },

  // Form card
  formCard: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusXl,
    borderWidth: 1,
    borderColor: T.cardBorder,
    padding: Sizes.paddingLg,
    gap: Sizes.gapMd,
    ...Shadows.md,
  },
  formHeader: {
    gap: 4,
    marginBottom: 4,
  },
  formTitle: {
    ...Typography.h3,
    color: T.textPrimary,
  },
  formSubtitle: {
    ...Typography.bodySm,
    color: T.textSecondary,
  },

  // Footer
  footer: { marginTop: 24, alignItems: "center", gap: 14 },
  linkPrimary: {
    color: T.primary,
    fontSize: 14,
    fontWeight: "700",
    backgroundColor: T.primaryMuted,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Sizes.radiusMd,
    overflow: "hidden",
  },
  linkSecondary: {
    color: T.textSecondary,
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
