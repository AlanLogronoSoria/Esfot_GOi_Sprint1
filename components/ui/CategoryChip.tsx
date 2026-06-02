import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LightTheme as T, Sizes } from '@/constants/design-system';

export type Category = { key: string; label: string };

interface CategoryChipProps {
  categories: Category[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export function CategoryChip({ categories, activeKey, onSelect }: CategoryChipProps) {
  const renderChip = useCallback(
    (cat: Category) => {
      const active = cat.key === activeKey;
      return (
        <TouchableOpacity
          key={cat.key}
          style={[styles.chip, active && styles.chipActive]}
          onPress={() => onSelect(cat.key)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, active && styles.chipTextActive]}>
            {cat.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [activeKey, onSelect]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      {categories.map(renderChip)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: Sizes.gapSm, paddingHorizontal: Sizes.paddingMd },
  chip: {
    backgroundColor: T.neutralMuted,
    borderRadius: Sizes.radiusFull,
    paddingHorizontal: Sizes.paddingLg,
    paddingVertical: Sizes.paddingSm,
  },
  chipActive: {
    backgroundColor: T.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
