import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useExpressAuthStore } from '@/services/express/express-auth.store';
import { useManagedUsers } from '@/features/admin/application/user-management.hooks';
import { UserRow } from '@/features/admin/presentation/user-row';
import { UserFilters } from '@/features/admin/presentation/user-filters';
import { UserEditModal } from '@/features/admin/presentation/user-edit-modal';
import { ConfirmDialog } from '@/features/admin/presentation/confirm-dialog';
import type { ManagedUser } from '@/features/admin/domain/user-management.entity';
import { useAuthStore } from '@/store/auth.store';
import { DarkTheme as T } from '@/constants/design-system';

export default function AdminUsersScreen() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'administrador';
  const expressUser = useExpressAuthStore((s) => s.expressUser);
  const expressLogin = useExpressAuthStore((s) => s.loginAdmin);

  const {
    users,
    total,
    page,
    totalPages,
    isLoading,
    filters,
    setSearch,
    setTypeFilter,
    setStatusFilter,
    setPage,
    updateUser,
    deleteUser,
    refresh,
  } = useManagedUsers();

  const [editTarget, setEditTarget] = useState<ManagedUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);

  const handleEdit = useCallback((u: ManagedUser) => setEditTarget(u), []);
  const handleDelete = useCallback((u: ManagedUser) => setDeleteTarget(u), []);
  const handleToggleStatus = useCallback((u: ManagedUser) => {
    updateUser.mutate({ user: u, updates: { status: u.status === 'activo' ? 'inactivo' : 'activo' } });
  }, [updateUser]);
  const handleSaveEdit = useCallback((u: ManagedUser, updates: Partial<ManagedUser>) => {
    updateUser.mutateAsync({ user: u, updates }).then(() => setEditTarget(null));
  }, [updateUser]);
  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) { deleteUser.mutateAsync(deleteTarget).then(() => setDeleteTarget(null)); }
  }, [deleteTarget, deleteUser]);

  if (!isAdmin) {
    return (
      <View style={styles.gate}>
        <Text style={styles.gateIcon}>🔒</Text>
        <Text style={styles.gateTitle}>Acceso restringido</Text>
        <Text style={styles.gateDesc}>Esta sección solo está disponible para administradores.</Text>
      </View>
    );
  }

  if (!expressUser) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Acceso Administrador</Text>
        <Text style={styles.authDesc}>
          Debes iniciar sesión como administrador en el sistema institucional para gestionar usuarios.
        </Text>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => expressLogin({ email: 'admin@epn.edu.ec', password: 'Test123!' })}
          activeOpacity={0.8}
        >
          <Text style={styles.authButtonText}>Iniciar sesión como Admin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Usuarios</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={refresh} activeOpacity={0.7}>
          <Text style={styles.refreshText}>↻</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <UserFilters
          filters={filters}
          onSearchChange={setSearch}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          total={total}
        />
      </View>

      {isLoading && (
        <ActivityIndicator size="large" color={T.primary} style={styles.loader} />
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserRow
            user={item}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No se encontraron usuarios</Text>
            </View>
          ) : null
        }
      />

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
            onPress={() => setPage(page - 1)}
            disabled={page <= 1}
            activeOpacity={0.7}
          >
            <Text style={styles.pageBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.pageInfo}>
            {page} de {totalPages}
          </Text>
          <TouchableOpacity
            style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
            onPress={() => setPage(page + 1)}
            disabled={page >= totalPages}
            activeOpacity={0.7}
          >
            <Text style={styles.pageBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      )}

      <UserEditModal
        visible={!!editTarget}
        user={editTarget}
        isLoading={updateUser.isPending}
        onSave={handleSaveEdit}
        onClose={() => setEditTarget(null)}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Eliminar usuario"
        message={`¿Estás seguro de eliminar a ${deleteTarget?.nombre} ${deleteTarget?.apellido ?? ''}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmStyle="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: T.textPrimary,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: T.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 18,
    color: T.primary,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loader: {
    marginTop: 20,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: T.textSecondary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 12,
    backgroundColor: T.surface,
    borderTopWidth: 1,
    borderTopColor: T.cardBorder,
  },
  pageBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: T.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: T.primary,
  },
  pageInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: T.textSecondary,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: T.background,
    gap: 16,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: T.textPrimary,
  },
  authDesc: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: T.primary,
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
  },
  authButtonText: {
    fontSize: 15, fontWeight: '700', color: T.surface,
  },
  gate: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 24, backgroundColor: T.background, gap: 12,
  },
  gateIcon: { fontSize: 48 },
  gateTitle: { fontSize: 20, fontWeight: '700', color: T.textPrimary },
  gateDesc: { fontSize: 14, color: T.textSecondary, textAlign: 'center' },
});
