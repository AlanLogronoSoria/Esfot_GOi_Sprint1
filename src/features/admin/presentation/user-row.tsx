import React, { memo } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import type { ManagedUser } from '@/features/admin/domain/user-management.entity';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

interface UserRowProps {
  user: ManagedUser;
  onEdit: (user: ManagedUser) => void;
  onToggleStatus: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}

export const UserRow = memo(function UserRow({
  user,
  onEdit,
  onToggleStatus,
  onDelete,
}: UserRowProps) {
  const isActive = user.status === 'activo';
  const initials = user.nombre.charAt(0).toUpperCase() + (user.apellido?.charAt(0)?.toUpperCase() ?? '');

  const roleColor =
    user.rol === 'administrador' ? '#DC2626' : user.rol === 'docente' ? '#7C3AED' : '#1B6BB0';

  return (
    <View style={[styles.card, !isActive && styles.cardInactive]}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: roleColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {user.nombre} {user.apellido ?? ''}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.meta}>
            <View style={[styles.roleBadge, { backgroundColor: roleColor + '15' }]}>
              <Text style={[styles.roleBadgeText, { color: roleColor }]}>{user.rol}</Text>
            </View>
            <Text style={styles.type}>{user.type}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{isActive ? 'Activo' : 'Inactivo'}</Text>
          <Switch
            value={isActive}
            onValueChange={() => onToggleStatus(user)}
            trackColor={{ false: T.textMuted, true: T.successBg }}
            thumbColor={isActive ? T.success : T.textTertiary}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit(user)}
            activeOpacity={0.7}
          >
            <Text style={styles.editBtnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(user)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteBtnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 10,
    ...Shadows.sm,
  },
  cardInactive: {
    opacity: 0.6,
    backgroundColor: T.inputBg,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: T.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: T.textPrimary,
  },
  email: {
    fontSize: 12,
    color: T.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  type: {
    fontSize: 10,
    color: T.textTertiary,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: T.cardBorder,
    paddingTop: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchLabel: {
    fontSize: 12,
    color: T.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: T.infoBg,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.info,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: T.errorBg,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.error,
  },
});
