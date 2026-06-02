import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { RouteCalculation } from '@/features/map/services/route-calculator';
import { formatRouteInfo } from '@/features/map/services/route-calculator';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

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
        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.value}>{info.distanceLabel}</Text>
            <Text style={styles.label}>Distancia</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Text style={styles.value}>{info.etaLabel}</Text>
            <Text style={styles.label}>Caminando</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Text style={styles.value}>{info.directionLabel}</Text>
            <Text style={styles.label}>Dirección</Text>
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
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.md,
    zIndex: 200,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    gap: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '800',
    color: T.primary,
  },
  label: {
    fontSize: 10,
    color: T.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: T.cardBorder,
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: T.textSecondary,
  },
});
