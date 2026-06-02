import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceMeters?: number;
  estimatedMinutes?: number;
  isActive?: boolean;
  color?: string;
  stops?: number;
  icon?: string;
}

interface RouteCardProps {
  route: Route;
  onPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  animationDelay?: number;
}

export function RouteCard({
  route,
  onPress,
  onFavoritePress,
  isFavorite = false,
  animationDelay = 0,
}: RouteCardProps) {
  const distanceLabel = route.distanceMeters
    ? route.distanceMeters >= 1000
      ? `${(route.distanceMeters / 1000).toFixed(1)} km`
      : `${Math.round(route.distanceMeters)} m`
    : null;

  const timeLabel = route.estimatedMinutes
    ? `${route.estimatedMinutes} min`
    : null;

  const accentColor = route.color ?? T.primary;

  return (
    <Animated.View entering={FadeInDown.delay(animationDelay).duration(400)}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.92}
      >
        {/* Color indicator */}
        <View style={[styles.colorBar, { backgroundColor: accentColor }]} />

        {/* Content */}
        <View style={styles.content}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <Text style={styles.icon}>{route.icon ?? '🗺️'}</Text>
            <Text style={styles.name} numberOfLines={1}>{route.name}</Text>
            {route.isActive !== undefined && (
              <View style={[
                styles.statusBadge,
                { backgroundColor: route.isActive ? T.successBg : T.errorBg }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: route.isActive ? T.success : T.error }
                ]}>
                  {route.isActive ? '● Activa' : '● Inactiva'}
                </Text>
              </View>
            )}
          </View>

          {/* Route path */}
          <View style={styles.pathRow}>
            <View style={styles.dot} />
            <Text style={styles.pathLabel} numberOfLines={1}>{route.origin}</Text>
          </View>
          <View style={styles.pathLine} />
          <View style={styles.pathRow}>
            <View style={[styles.dot, { backgroundColor: T.accent }]} />
            <Text style={styles.pathLabel} numberOfLines={1}>{route.destination}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {distanceLabel && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{distanceLabel}</Text>
                <Text style={styles.statLabel}>Distancia</Text>
              </View>
            )}
            {timeLabel && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{timeLabel}</Text>
                  <Text style={styles.statLabel}>Tiempo</Text>
                </View>
              </>
            )}
            {route.stops !== undefined && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{route.stops}</Text>
                  <Text style={styles.statLabel}>Paradas</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Favorite button */}
        {onFavoritePress && (
          <TouchableOpacity
            style={styles.favBtn}
            onPress={onFavoritePress}
            hitSlop={8}
            activeOpacity={0.7}
          >
            <Text style={styles.favIcon}>{isFavorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    marginBottom: Sizes.gapMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  colorBar: {
    width: 5,
    backgroundColor: T.primary,
  },
  content: {
    flex: 1,
    padding: Sizes.paddingMd,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  icon: { fontSize: 18 },
  name: {
    ...Typography.h4,
    color: T.textPrimary,
    fontSize: 15,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.primary,
    marginLeft: 2,
  },
  pathLine: {
    width: 1,
    height: 12,
    backgroundColor: T.divider,
    marginLeft: 6,
  },
  pathLabel: {
    ...Typography.bodySm,
    color: T.textSecondary,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: T.divider,
  },
  stat: { alignItems: 'center' },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: T.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: T.textTertiary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: T.divider,
  },
  favBtn: {
    padding: Sizes.paddingMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favIcon: { fontSize: 20 },
});
