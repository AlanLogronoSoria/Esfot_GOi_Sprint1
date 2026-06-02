import React, { memo } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import type { ManagedUserType, UserFiltersState } from '@/features/admin/domain/user-management.entity';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

interface UserFiltersProps {
  filters: UserFiltersState;
  onSearchChange: (search: string) => void;
  onTypeChange: (type: ManagedUserType | 'todos') => void;
  onStatusChange: (status: UserFiltersState['status']) => void;
  total: number;
}

const TYPE_CHIPS: { key: ManagedUserType | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'estudiante', label: 'Estudiantes' },
  { key: 'docente', label: 'Docentes' },
];

const STATUS_CHIPS: { key: UserFiltersState['status']; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'activo', label: 'Activos' },
  { key: 'inactivo', label: 'Inactivos' },
];

export const UserFilters = memo(function UserFilters({
  filters,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  total,
}: UserFiltersProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍  Buscar usuarios..."
        placeholderTextColor={T.inputPlaceholder}
        value={filters.search}
        onChangeText={onSearchChange}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {TYPE_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            style={[styles.chip, filters.type === chip.key && styles.chipActive]}
            onPress={() => onTypeChange(chip.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, filters.type === chip.key && styles.chipTextActive]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {STATUS_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            style={[styles.chip, filters.status === chip.key && styles.chipActive]}
            onPress={() => onStatusChange(chip.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, filters.status === chip.key && styles.chipTextActive]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.count}>{total} usuarios encontrados</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  searchInput: {
    backgroundColor: T.surface,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: T.textPrimary,
    ...Shadows.sm,
  },
  chips: {
    gap: 6,
  },
  chip: {
    backgroundColor: T.surface,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  chipActive: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textSecondary,
  },
  chipTextActive: {
    color: T.surface,
  },
  count: {
    fontSize: 12,
    color: T.textTertiary,
    textAlign: 'right',
  },
});
