import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LightTheme as T, Sizes, Typography, Shadows } from '@/constants/design-system';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  delay?: number;
}

export function EmptyState({
  icon = '📭',
  title,
  subtitle,
  actionLabel,
  onAction,
  delay = 0,
}: EmptyStateProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500)}
      style={styles.container}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.btn} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.btnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Sizes.paddingXl,
    gap: Sizes.gapMd,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: { fontSize: 36 },
  title: {
    ...Typography.h4,
    color: T.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySm,
    color: T.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: {
    marginTop: 8,
    backgroundColor: T.primary,
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: 28,
    paddingVertical: 13,
    ...Shadows.sm,
  },
  btnText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 14,
  },
});
