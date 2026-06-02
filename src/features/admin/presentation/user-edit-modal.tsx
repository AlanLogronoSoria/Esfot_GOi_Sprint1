import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { ManagedUser, ManagedUserRole } from '@/features/admin/domain/user-management.entity';
import { RoleDropdown } from './role-dropdown';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

interface UserEditModalProps {
  visible: boolean;
  user: ManagedUser | null;
  isLoading: boolean;
  onSave: (user: ManagedUser, updates: Partial<ManagedUser>) => void;
  onClose: () => void;
}

export function UserEditModal({ visible, user, isLoading, onSave, onClose }: UserEditModalProps) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [role, setRole] = useState<ManagedUserRole>('estudiante');

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setApellido(user.apellido ?? '');
      setEmail(user.email);
      setTelefono(user.telefono ?? '');
      setDireccion(user.direccion ?? '');
      setRole(user.rol);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    onSave(user, {
      nombre: nombre.trim(),
      apellido: apellido.trim() || undefined,
      email: email.trim(),
      telefono: telefono.trim() || undefined,
      direccion: direccion.trim() || undefined,
      rol: role,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar usuario</Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading} activeOpacity={0.7}>
            <Text style={styles.saveText}>{isLoading ? '...' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {isLoading && (
            <ActivityIndicator size="large" color={T.primary} style={styles.loader} />
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <RNTextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre"
              placeholderTextColor={T.inputPlaceholder}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Apellido</Text>
            <RNTextInput
              style={styles.input}
              value={apellido}
              onChangeText={setApellido}
              placeholder="Apellido"
              placeholderTextColor={T.inputPlaceholder}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Correo</Text>
            <RNTextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              placeholderTextColor={T.inputPlaceholder}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Teléfono</Text>
            <RNTextInput
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="0991234567"
              keyboardType="phone-pad"
              placeholderTextColor={T.inputPlaceholder}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Dirección</Text>
            <RNTextInput
              style={styles.input}
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Dirección"
              placeholderTextColor={T.inputPlaceholder}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Rol</Text>
            <RoleDropdown value={role} onChange={setRole} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: T.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: T.surface,
    padding: 16,
    paddingTop: 56,
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.textPrimary,
  },
  cancelText: {
    fontSize: 15,
    color: T.textSecondary,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: T.primary,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  loader: {
    marginBottom: 12,
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
    padding: 14,
    fontSize: 15,
    color: T.textPrimary,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
});
