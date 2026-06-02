import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  Alert,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Redirect, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { UserEntity } from '@/features/auth/domain/user.entity';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';

// ─── Info Row ───
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Stat Card ───
function StatCard({ value, label, icon }: { value: string | number; label: string; icon: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Menu Link ───
function MenuLink({
  icon, label, onPress, danger = false, isLast = false,
}: { icon: string; label: string; onPress: () => void; danger?: boolean; isLast?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.menuLink, isLast && styles.menuLinkLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.menuLinkIcon}>{icon}</Text>
      <Text style={[styles.menuLinkLabel, danger && styles.menuLinkDanger]}>{label}</Text>
      <Text style={styles.menuLinkArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const secureLogout = useAuthStore((s) => s.secureLogout);

  if (isInitialized && !user) return <Redirect href="/auth/login" />;
  if (!user) return null;

  const ue = new UserEntity(user);

  const roleLabel =
    user.role === 'administrador'
      ? 'Administrador'
      : user.role === 'docente'
      ? 'Docente'
      : 'Estudiante';

  const roleColor =
    user.role === 'administrador'
      ? T.accent
      : user.role === 'docente'
      ? T.highlight
      : T.primary;

  const handleLogout = useCallback(async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await secureLogout();
          router.replace('/auth/login');
        },
      },
    ]);
  }, [secureLogout, router]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero section */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.hero}>
          {/* Background gradient shape */}
          <View style={styles.heroBg} />

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            {(user as any)?.avatarUrl ? (
              <Image source={{ uri: (user as any).avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{ue.initials}</Text>
              </View>
            )}
            <View style={[styles.roleDot, { backgroundColor: roleColor }]} />
          </View>

          {/* Name & role */}
          <Text style={styles.heroName}>{ue.displayName}</Text>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + '18' }]}>
            <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel}</Text>
          </View>
          <Text style={styles.heroEmail}>{user.email}</Text>

          {/* Edit button */}
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.85}
            onPress={() => {}}
          >
            <Text style={styles.editBtnText}>✏️ Editar perfil</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.statsRow}>
          <StatCard value={12} label="Eventos" icon="📅" />
          <View style={styles.statDivider} />
          <StatCard value={4} label="Favoritos" icon="⭐" />
          <View style={styles.statDivider} />
          <StatCard value={8} label="Rutas" icon="🗺️" />
        </Animated.View>

        {/* Personal info */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Información personal</Text>
          <InfoRow icon="👤" label="Nombre completo" value={ue.displayName} />
          <View style={styles.divider} />
          <InfoRow icon="📧" label="Correo institucional" value={user.email ?? '—'} />
          <View style={styles.divider} />
          <InfoRow icon="📱" label="Teléfono" value={(user as any)?.phone ?? 'No registrado'} />
          <View style={styles.divider} />
          <InfoRow icon="🎓" label="Rol" value={roleLabel} />
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(240).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Acciones rápidas</Text>
          <MenuLink
            icon="⭐"
            label="Mis favoritos"
            onPress={() => router.push('/favorites' as any)}
          />
          <MenuLink
            icon="📅"
            label="Mis eventos"
            onPress={() => router.push('/events' as any)}
          />
          <MenuLink
            icon="⚙️"
            label="Configuración"
            onPress={() => router.push('/config' as any)}
          />
          <MenuLink
            icon="❓"
            label="Ayuda"
            onPress={() => router.push('/help' as any)}
            isLast
          />
        </Animated.View>

        {/* Security */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Seguridad</Text>
          <MenuLink
            icon="🔑"
            label="Cambiar contraseña"
            onPress={() => router.push('/auth/recover' as any)}
          />
          <MenuLink
            icon="🚪"
            label="Cerrar sesión"
            onPress={handleLogout}
            danger
            isLast
          />
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  // Hero
  hero: {
    backgroundColor: T.surface,
    alignItems: 'center',
    paddingBottom: Sizes.paddingXl,
    marginBottom: Sizes.gapMd,
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: T.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarWrap: {
    marginTop: 72,
    marginBottom: 12,
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: T.surface,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: T.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: T.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: T.primary,
  },
  roleDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: T.surface,
  },
  heroName: {
    ...Typography.h3,
    color: T.textPrimary,
    textAlign: 'center',
  },
  roleBadge: {
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: Sizes.radiusFull,
    marginBottom: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  heroEmail: {
    ...Typography.bodySm,
    color: T.textTertiary,
    marginBottom: 16,
  },
  editBtn: {
    backgroundColor: T.primary,
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: 24,
    paddingVertical: 11,
    ...Shadows.sm,
  },
  editBtnText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 14,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Sizes.paddingMd,
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingMd,
    marginBottom: Sizes.gapMd,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  statCard: { alignItems: 'center', gap: 4, flex: 1 },
  statIcon: { fontSize: 22 },
  statValue: { ...Typography.h3, color: T.primary, fontSize: 22 },
  statLabel: { fontSize: 11, color: T.textTertiary, fontWeight: '500' },
  statDivider: { width: 1, height: 40, backgroundColor: T.divider },

  // Card
  card: {
    marginHorizontal: Sizes.paddingMd,
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingMd,
    marginBottom: Sizes.gapMd,
    gap: 12,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: T.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  // Info row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 11, color: T.textTertiary, fontWeight: '500', marginBottom: 2 },
  infoValue: { ...Typography.bodySm, color: T.textPrimary, fontWeight: '500' },
  divider: { height: 1, backgroundColor: T.divider },

  // Menu link
  menuLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.divider,
    gap: 12,
  },
  menuLinkLast: { borderBottomWidth: 0 },
  menuLinkIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  menuLinkLabel: { ...Typography.body, color: T.textPrimary, flex: 1, fontSize: 15 },
  menuLinkDanger: { color: T.error },
  menuLinkArrow: { fontSize: 22, color: T.textTertiary },
});
