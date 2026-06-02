import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LightTheme as T, Sizes, Typography } from '@/constants/design-system';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress} activeOpacity={0.7}>
          <Text style={styles.action}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.paddingMd,
  },
  textWrap: { flex: 1, gap: 2 },
  title: { ...Typography.h3, color: T.textPrimary },
  subtitle: { ...Typography.bodySm, color: T.textSecondary },
  action: { ...Typography.bodySm, color: T.primary, fontWeight: '700' },
});
