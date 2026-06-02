import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';
import type { BusRoute } from '@/features/polibus/domain/route.entity';

interface TransportCardProps {
  routes: BusRoute[];
  activeRoutes: number;
}

export function TransportCard({ routes, activeRoutes }: TransportCardProps) {
  return (
    <Link href="/polibus" asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🚌</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>Polibus</Text>
            <Text style={styles.subtitle}>
              {activeRoutes} ruta{activeRoutes !== 1 ? 's' : ''} activa{activeRoutes !== 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </View>
        {routes.length > 0 && (
          <View style={styles.routeList}>
            {routes.slice(0, 3).map((r) => (
              <View key={r.id} style={styles.routeItem}>
                <View style={[styles.routeDot, { backgroundColor: r.color }]} />
                <Text style={styles.routeName} numberOfLines={1}>{r.name}</Text>
                <View style={[styles.routeBadge, r.isActive ? styles.routeBadgeActive : styles.routeBadgeInactive]}>
                  <Text style={[styles.routeBadgeText, r.isActive ? styles.routeBadgeTextActive : styles.routeBadgeTextInactive]}>
                    {r.isActive ? 'Activa' : 'Inactiva'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingLg,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
    gap: Sizes.gapMd,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: T.highlightMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 22 },
  info: { flex: 1 },
  title: { ...Typography.h4, color: T.textPrimary },
  subtitle: { ...Typography.bodySm, color: T.textSecondary },
  arrow: { fontSize: 20, color: T.textTertiary },
  routeList: {
    borderTopWidth: 1,
    borderTopColor: T.divider,
    paddingTop: Sizes.gapSm,
    gap: 8,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeName: {
    ...Typography.bodySm,
    color: T.textPrimary,
    flex: 1,
  },
  routeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  routeBadgeActive: {
    backgroundColor: T.successBg,
  },
  routeBadgeInactive: {
    backgroundColor: T.neutralMuted,
  },
  routeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  routeBadgeTextActive: {
    color: T.success,
  },
  routeBadgeTextInactive: {
    color: T.textTertiary,
  },
});
