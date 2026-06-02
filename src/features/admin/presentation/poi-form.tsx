import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { CampusLocation } from '@/features/map/domain/location.entity';
import type { PoiInput, PoiUpdateInput } from '@/features/admin/domain/poi.entity';
import { getAllCategories } from '@/features/map/application/map.hooks';
import { DarkTheme as T } from '@/constants/design-system';

interface PoiFormProps {
  initialCoordinate?: { latitude: number; longitude: number };
  editingPoi?: CampusLocation | null;
  isLoading: boolean;
  onSubmit: (input: PoiInput) => void;
  onUpdate: (id: string, input: PoiUpdateInput) => void;
  onCancel: () => void;
}

export function PoiForm({
  initialCoordinate,
  editingPoi,
  isLoading,
  onSubmit,
  onUpdate,
  onCancel,
}: PoiFormProps) {
  const [name, setName] = useState(editingPoi?.name ?? '');
  const [description, setDescription] = useState(editingPoi?.description ?? '');
  const [category, setCategory] = useState(editingPoi?.category ?? 'academico');
  const categories = getAllCategories();

  const isEditing = !!editingPoi;

  const handleSubmit = () => {
    if (!name.trim()) return;

    const lat: number = editingPoi?.latitude ?? initialCoordinate?.latitude ?? 0;
    const lng: number = editingPoi?.longitude ?? initialCoordinate?.longitude ?? 0;

    if (isEditing && editingPoi) {
      onUpdate(editingPoi.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
      });
    } else {
      onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        latitude: lat,
        longitude: lng,
      });
    }
  };

  useEffect(() => {
    if (editingPoi) {
      setName(editingPoi.name);
      setDescription(editingPoi.description ?? '');
      setCategory(editingPoi.category);
    }
  }, [editingPoi]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? 'Editar ubicación' : 'Nueva ubicación'}
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ej: Laboratorio de Física"
          placeholderTextColor={T.inputPlaceholder}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción del lugar"
          placeholderTextColor={T.inputPlaceholder}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Categoría</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.chip,
                category === cat.key && { backgroundColor: cat.color, borderColor: cat.color },
              ]}
              onPress={() => setCategory(cat.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipEmoji}>{cat.icon}</Text>
              <Text style={[styles.chipText, category === cat.key && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
          onPress={handleSubmit}
          disabled={isLoading || !name.trim()}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={T.surface} size="small" />
          ) : (
            <Text style={styles.saveText}>{isEditing ? 'Actualizar' : 'Guardar'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: T.textPrimary,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: T.surface,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: T.textPrimary,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  textarea: {
    height: 72,
    textAlignVertical: 'top',
  },
  chips: {
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: T.surface,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  chipEmoji: {
    fontSize: 13,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: T.textSecondary,
  },
  chipTextActive: {
    color: T.surface,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: T.inputBg,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.textSecondary,
  },
  saveBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: T.primary,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.surface,
  },
});
