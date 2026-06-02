import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useTutorias } from '@/features/tutorias/application/tutorias.hooks';
import type { Tutoria } from '@/features/tutorias/domain/tutoria.entity';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

const STATUS_CHIPS: { key: Tutoria['status'] | 'todas'; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'programada', label: 'Programadas' },
  { key: 'finalizada', label: 'Finalizadas' },
  { key: 'cancelada', label: 'Canceladas' },
];

const STATUS_COLORS: Record<Tutoria['status'], string> = {
  programada: '#1B6BB0',
  en_curso: '#059669',
  finalizada: '#6B7280',
  cancelada: '#DC2626',
};

export default function TutoriasScreen() {
  const {
    tutorias, isLoading, search, setSearch,
    statusFilter, setStatusFilter,
    cancelTutoria,
  } = useTutorias();

  const renderItem = useCallback(({ item }: { item: Tutoria }) => {
    const isPast = item.status === 'finalizada' || item.status === 'cancelada';
    const statusColor = STATUS_COLORS[item.status];

    return (
      <View style={[styles.card, isPast && styles.cardPast]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.subject}>{item.subject}</Text>
        </View>

        {item.description && (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        )}

        <View style={styles.meta}>
          <Text style={styles.metaItem}>📅 {item.date} · {item.time}</Text>
          <Text style={styles.metaItem}>⏱️ {item.duration} min</Text>
          {item.location && <Text style={styles.metaItem}>📍 {item.location}</Text>}
          <Text style={styles.metaItem}>
            👥 {item.enrolledCount}/{item.maxStudents} estudiantes
          </Text>
        </View>

        {item.status === 'programada' && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => cancelTutoria.mutate(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelBtnText}>Cancelar tutoría</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [cancelTutoria]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tutorías</Text>
        <Text style={styles.subtitle}>Gestión de sesiones de tutoría</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="🔍 Buscar tutorías..."
        placeholderTextColor={T.inputPlaceholder}
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {STATUS_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            style={[styles.chip, statusFilter === chip.key && styles.chipActive]}
            onPress={() => setStatusFilter(chip.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, statusFilter === chip.key && styles.chipTextActive]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading && <ActivityIndicator size="large" color={T.primary} style={{ marginTop: 20 }} />}

      <FlatList
        data={tutorias}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No se encontraron tutorías</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.background },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: T.textPrimary },
  subtitle: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  search: {
    marginHorizontal: 16, marginBottom: 8, backgroundColor: T.surface,
    borderRadius: 10, padding: 12, fontSize: 14, color: T.textPrimary, ...Shadows.sm,
  },
  filters: { paddingHorizontal: 16, gap: 6, marginBottom: 8 },
  chip: {
    backgroundColor: T.surface, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: T.cardBorder,
  },
  chipActive: { backgroundColor: T.primary, borderColor: T.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: T.textSecondary },
  chipTextActive: { color: T.surface },
  list: { padding: 16, paddingTop: 4 },
  card: {
    backgroundColor: T.surface, borderRadius: 14, padding: 16, gap: 10,
    marginBottom: 12, ...Shadows.sm,
  },
  cardPast: { opacity: 0.6 },
  cardHeader: { gap: 2 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: T.textPrimary, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  subject: { fontSize: 12, color: T.textSecondary },
  description: { fontSize: 13, color: T.textSecondary, lineHeight: 18 },
  meta: { gap: 4 },
  metaItem: { fontSize: 12, color: T.textSecondary },
  cancelBtn: {
    borderTopWidth: 1, borderTopColor: T.cardBorder, paddingTop: 10,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 13, fontWeight: '600', color: T.error },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: T.textSecondary },
});
