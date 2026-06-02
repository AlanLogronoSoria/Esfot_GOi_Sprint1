import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { RouteCalculation } from '@/features/map/services/route-calculator';
import { formatRouteInfo } from '@/features/map/services/route-calculator';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LightTheme as T, Shadows, Sizes, Typography } from '@/constants/design-system';

interface RouteInfoCardProps {
  route: RouteCalculation | null;
  isVisible: boolean;
  onClear: () => void;
}

export const RouteInfoCard = memo(
  function RouteInfoCard({ route, isVisible, onClear }: RouteInfoCardProps) {
    const info = useMemo(() => (route ? formatRouteInfo(route) : null), [route]);

    if (!isVisible || !route || !info) return null;

    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        style={styles.card}
      >
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>⏱</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.label}>Llegada estimada</Text>
            <Text style={styles.value}>
              {info.etaLabel} <Text style={styles.distance}>({info.distanceLabel})</Text>
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={onClear} activeOpacity={0.7}>
          <Text style={styles.clearBtnText}>✕</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  },
  (prev, next) =>
    prev.isVisible === next.isVisible &&
    prev.route?.distance === next.route?.distance
);

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: T.surfaceGlass,
    borderRadius: Sizes.radiusLg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    ...Shadows.lg,
    zIndex: 200,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 20 },
  info: { flex: 1, gap: 2 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: T.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    ...Typography.h4,
    color: T.textPrimary,
  },
  distance: {
    ...Typography.bodySm,
    color: T.textSecondary,
    fontWeight: '400',
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.neutralMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: T.textSecondary,
  },
});
