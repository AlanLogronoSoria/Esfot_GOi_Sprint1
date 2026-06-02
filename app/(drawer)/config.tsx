import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';
import { GlassHeader } from '@/components/ui/GlassHeader';
import { useAuthStore } from '@/store/auth.store';

// ─── Setting Row ───
function SettingRow({
  icon, label, value, onPress, rightElement, isLast = false,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, isLast && styles.rowLast]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !rightElement}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        {rightElement}
        {onPress && !rightElement && (
          <Text style={styles.rowChevron}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Settings Group ───
function SettingGroup({
  title, icon, children, delay = 0,
}: { title: string; icon: string; children: React.ReactNode; delay?: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.group}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupIcon}>{icon}</Text>
        <Text style={styles.groupTitle}>{title}</Text>
      </View>
      <View style={styles.groupCard}>
        {children}
      </View>
    </Animated.View>
  );
}

export default function ConfigScreen() {
  const router = useRouter();
  const secureLogout = useAuthStore((s) => s.secureLogout);

  // Notification toggles
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifPolibus, setNotifPolibus] = useState(true);
  const [notifNoticias, setNotifNoticias] = useState(false);

  // Map prefs
  const [mapUnits, setMapUnits] = useState<'metros' | 'km'>('metros');
  const [highQualityMap, setHighQualityMap] = useState(true);

  // Privacy
  const [shareLocation, setShareLocation] = useState(true);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const handleLogout = useCallback(async () => {
    await secureLogout();
    router.replace('/auth/login');
  }, [secureLogout, router]);

  return (
    <View style={styles.root}>
      <GlassHeader
        scrollY={scrollY}
        onAvatarPress={() => router.push('/profile' as any)}
      />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.subtitle}>Personaliza tu experiencia en ESFOT Go</Text>
        </Animated.View>

        {/* Notificaciones */}
        <SettingGroup title="Notificaciones" icon="🔔" delay={80}>
          <SettingRow
            icon="📅"
            label="Eventos del campus"
            rightElement={
              <Switch
                value={notifEvents}
                onValueChange={setNotifEvents}
                trackColor={{ false: T.inputBorder, true: T.primaryMuted }}
                thumbColor={notifEvents ? T.primary : T.textTertiary}
              />
            }
          />
          <SettingRow
            icon="🚌"
            label="Actualizaciones Polibus"
            rightElement={
              <Switch
                value={notifPolibus}
                onValueChange={setNotifPolibus}
                trackColor={{ false: T.inputBorder, true: T.primaryMuted }}
                thumbColor={notifPolibus ? T.primary : T.textTertiary}
              />
            }
          />
          <SettingRow
            icon="📰"
            label="Noticias institucionales"
            isLast
            rightElement={
              <Switch
                value={notifNoticias}
                onValueChange={setNotifNoticias}
                trackColor={{ false: T.inputBorder, true: T.primaryMuted }}
                thumbColor={notifNoticias ? T.primary : T.textTertiary}
              />
            }
          />
        </SettingGroup>

        {/* Mapa */}
        <SettingGroup title="Mapa y Navegación" icon="🗺️" delay={140}>
          <SettingRow
            icon="📏"
            label="Unidades de distancia"
            rightElement={
              <View style={styles.segmented}>
                {(['metros', 'km'] as const).map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.segBtn, mapUnits === u && styles.segBtnActive]}
                    onPress={() => setMapUnits(u)}
                  >
                    <Text style={[styles.segText, mapUnits === u && styles.segTextActive]}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
          <SettingRow
            icon="🖼️"
            label="Mapa de alta calidad"
            isLast
            rightElement={
              <Switch
                value={highQualityMap}
                onValueChange={setHighQualityMap}
                trackColor={{ false: T.inputBorder, true: T.primaryMuted }}
                thumbColor={highQualityMap ? T.primary : T.textTertiary}
              />
            }
          />
        </SettingGroup>

        {/* Privacidad */}
        <SettingGroup title="Privacidad" icon="🔒" delay={200}>
          <SettingRow
            icon="📍"
            label="Compartir mi ubicación"
            rightElement={
              <Switch
                value={shareLocation}
                onValueChange={setShareLocation}
                trackColor={{ false: T.inputBorder, true: T.primaryMuted }}
                thumbColor={shareLocation ? T.primary : T.textTertiary}
              />
            }
          />
          <SettingRow
            icon="📋"
            label="Términos y condiciones"
            onPress={() => {}}
            isLast
          />
        </SettingGroup>

        {/* Cuenta */}
        <SettingGroup title="Cuenta" icon="👤" delay={260}>
          <SettingRow
            icon="🔑"
            label="Cambiar contraseña"
            onPress={() => router.push('/auth/recover' as any)}
          />
          <SettingRow
            icon="📧"
            label="Actualizar correo"
            onPress={() => router.push('/profile' as any)}
            isLast
          />
        </SettingGroup>

        {/* Información */}
        <SettingGroup title="Información" icon="ℹ️" delay={320}>
          <SettingRow
            icon="📱"
            label="Versión de la app"
            value="1.0.0"
          />
          <SettingRow
            icon="🏫"
            label="ESFOT - EPN"
            value="2025-2026"
          />
          <SettingRow
            icon="❓"
            label="Centro de ayuda"
            onPress={() => router.push('/help' as any)}
            isLast
          />
        </SettingGroup>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(380).duration(400)} style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  scroll: { flex: 1 },
  content: { paddingTop: 8 },

  header: {
    paddingHorizontal: Sizes.paddingMd,
    paddingTop: 72,
    paddingBottom: Sizes.gapMd,
    gap: 4,
  },
  title: { ...Typography.h2, color: T.textPrimary },
  subtitle: { ...Typography.body, color: T.textSecondary },

  group: {
    paddingHorizontal: Sizes.paddingMd,
    marginBottom: Sizes.gapLg,
    gap: Sizes.gapSm,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  groupIcon: { fontSize: 16 },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: T.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  groupCard: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    borderWidth: 1,
    borderColor: T.cardBorder,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.paddingMd,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.divider,
    gap: 12,
    minHeight: 52,
  },
  rowLast: { borderBottomWidth: 0 },
  rowIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  rowLabel: { ...Typography.body, color: T.textPrimary, flex: 1, fontSize: 15 },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: { ...Typography.bodySm, color: T.textSecondary },
  rowChevron: { fontSize: 22, color: T.textTertiary, marginRight: -4 },

  segmented: {
    flexDirection: 'row',
    backgroundColor: T.inputBg,
    borderRadius: 8,
    padding: 2,
  },
  segBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  segBtnActive: {
    backgroundColor: T.primary,
  },
  segText: { fontSize: 12, fontWeight: '600', color: T.textSecondary },
  segTextActive: { color: '#FFFFFF' },

  logoutSection: {
    paddingHorizontal: Sizes.paddingMd,
    marginTop: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: T.errorBg,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingMd,
    borderWidth: 1,
    borderColor: T.error + '30',
  },
  logoutIcon: { fontSize: 20 },
  logoutText: {
    ...Typography.button,
    color: T.error,
    fontSize: 15,
  },
});
