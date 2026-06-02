import React, { memo } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { EventDateFilter } from '../domain/event.entity';
import { LightTheme as T, Sizes } from '@/constants/design-system';

interface EventFiltersProps {
  dateFilter: EventDateFilter;
  onDateFilterChange: (filter: EventDateFilter) => void;
}

const FILTERS: { key: EventDateFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'proximos', label: 'Próximos' },
  { key: 'este_mes', label: 'Este mes' },
  { key: 'pasados', label: 'Pasados' },
];

export const EventFilters = memo(function EventFilters({ dateFilter, onDateFilterChange }: EventFiltersProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 44 }} contentContainerStyle={ss.c}>
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.key}
          style={[ss.chip, dateFilter === f.key && ss.chipOn]}
          onPress={() => onDateFilterChange(f.key)}
          activeOpacity={0.7}
        >
          <Text style={[ss.ct, dateFilter === f.key && ss.ctOn]}>{f.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

const ss = StyleSheet.create({
  c: { gap: 8, paddingHorizontal: 16 },
  chip: { backgroundColor: T.surface, borderRadius: Sizes.radiusFull, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: T.cardBorder },
  chipOn: { backgroundColor: T.primary, borderColor: T.primary },
  ct: { fontSize: 12, fontWeight: '600', color: T.textSecondary },
  ctOn: { color: T.text },
});
