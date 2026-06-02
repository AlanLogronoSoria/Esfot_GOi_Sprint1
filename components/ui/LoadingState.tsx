import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { LightTheme as T, Sizes, Typography } from '@/constants/design-system';

interface LoadingStateProps {
  message?: string;
  /** Si true, muestra skeleton en vez de spinner */
  skeleton?: boolean;
  /** Número de ítems skeleton */
  skeletonCount?: number;
}

export function LoadingState({ message, skeleton, skeletonCount = 3 }: LoadingStateProps) {
  if (skeleton) {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 80} />
        ))}
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={styles.spinnerWrap}>
        <ActivityIndicator size="large" color={T.primary} />
      </View>
      {message && <Text style={styles.message}>{message}</Text>}
    </Animated.View>
  );
}

function SkeletonCard({ delay }: { delay: number }) {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.skeletonCard, style]}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonCircle} />
        <View style={styles.skeletonLines}>
          <View style={[styles.skeletonLine, { width: '60%' }]} />
          <View style={[styles.skeletonLine, { width: '40%', height: 10 }]} />
        </View>
      </View>
      <View style={[styles.skeletonLine, { width: '100%', height: 12 }]} />
      <View style={[styles.skeletonLine, { width: '80%', height: 12 }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: Sizes.gapMd,
  },
  spinnerWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: T.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    ...Typography.bodySm,
    color: T.textSecondary,
    textAlign: 'center',
  },
  skeletonContainer: {
    padding: Sizes.paddingMd,
    gap: Sizes.gapMd,
  },
  skeletonCard: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingMd,
    gap: Sizes.gapMd,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.gapMd,
  },
  skeletonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.neutralMuted,
  },
  skeletonLines: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: T.neutralMuted,
    borderRadius: 6,
  },
});
