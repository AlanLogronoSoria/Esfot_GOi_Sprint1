import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import type { ManagedUserRole } from '@/features/admin/domain/user-management.entity';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

const ROLES: { key: ManagedUserRole; label: string; color: string }[] = [
  { key: 'estudiante', label: 'Estudiante', color: '#1B6BB0' },
  { key: 'docente', label: 'Docente', color: '#7C3AED' },
  { key: 'administrador', label: 'Administrador', color: '#DC2626' },
];

interface RoleDropdownProps {
  value: ManagedUserRole;
  onChange: (role: ManagedUserRole) => void;
}

export function RoleDropdown({ value, onChange }: RoleDropdownProps) {
  const [open, setOpen] = useState(false);
  const current = ROLES.find((r) => r.key === value) ?? ROLES[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.trigger, { borderColor: current.color }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <View style={[styles.dot, { backgroundColor: current.color }]} />
        <Text style={styles.triggerText}>{current.label}</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Seleccionar rol</Text>
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role.key}
                style={[styles.option, value === role.key && styles.optionActive]}
                onPress={() => {
                  onChange(role.key);
                  setOpen(false);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.dot, { backgroundColor: role.color }]} />
                <Text style={styles.optionText}>{role.label}</Text>
                {value === role.key && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.surface,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1.5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  triggerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: T.textPrimary,
  },
  chevron: {
    fontSize: 10,
    color: T.textTertiary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dropdown: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    width: '100%',
    maxWidth: 280,
    gap: 4,
    ...Shadows.lg,
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.textPrimary,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
  },
  optionActive: {
    backgroundColor: T.inputBg,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: T.textPrimary,
  },
  check: {
    fontSize: 14,
    fontWeight: '700',
    color: T.primary,
  },
});
