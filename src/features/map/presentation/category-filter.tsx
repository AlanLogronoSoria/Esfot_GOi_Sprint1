import React, { memo } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getAllCategories } from '@/features/map/application/map.hooks';
import { LightTheme as T, Sizes, Shadows } from '@/constants/design-system';

interface CategoryFilterProps { selectedCategory: string | undefined; onSelectCategory: (c: string | undefined) => void; }

export const CategoryFilter = memo(function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const cats = getAllCategories();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 48 }} contentContainerStyle={s.c}>
      <TouchableOpacity style={[s.chip, !selectedCategory && s.chipOn]} onPress={() => onSelectCategory(undefined)} activeOpacity={0.7}>
        <Text style={[s.ct, !selectedCategory && s.ctOn]}>Todos</Text>
      </TouchableOpacity>
      {cats.map((cat) => {
        const active = selectedCategory === cat.key;
        return (
          <TouchableOpacity key={cat.key} style={[s.chip, active && { backgroundColor: cat.color, borderColor: cat.color }]} onPress={() => onSelectCategory(active ? undefined : cat.key)} activeOpacity={0.7}>
            <Text style={s.ce}>{cat.icon}</Text>
            <Text style={[s.ct, active && s.ctOn]}>{cat.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

const s = StyleSheet.create({
  c: { gap: 8, paddingHorizontal: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: T.surfaceGlass, borderRadius: Sizes.radiusFull, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: T.cardBorder, ...Shadows.sm },
  chipOn: { backgroundColor: T.primary, borderColor: T.primary },
  ce: { fontSize: 14 },
  ct: { fontSize: 13, fontWeight: '600', color: T.textPrimary },
  ctOn: { color: '#FFFFFF' },
});
