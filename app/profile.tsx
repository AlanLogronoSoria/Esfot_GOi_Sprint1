import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useAuth } from '@/hooks/useAuth';
import * as authService from '@/services/auth';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSave = async () => {
    if (!email.includes('@')) return Alert.alert('Email inválido');
    if (phone && !/^[0-9()+\- ]{7,15}$/.test(phone)) return Alert.alert('Teléfono inválido');

    await updateProfile({ name, email });
    Alert.alert('Perfil actualizado');
  };

  const onChangePassword = async () => {
    if (!newPassword || newPassword.length < 8)
      return Alert.alert('Contraseña inválida', 'Mínimo 8 caracteres');

    if (newPassword !== confirmPassword)
      return Alert.alert('Error', 'Las contraseñas no coinciden');

    try {
      await authService.changePasswordAPI(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Éxito', 'Contraseña actualizada');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cambiar la contraseña');
    }
  };

  const onLogout = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: 'Perfil' }} />

      {/* HEADER */}
      <Text style={s.title}>Mi perfil</Text>

      {/* DATOS */}
      <View style={s.card}>
        <Text style={s.sectionTitle}>Datos personales</Text>

        <TextInput label="Nombre" value={name} onChangeText={setName} />
        <TextInput
          label="Teléfono"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button title="Guardar cambios" onPress={onSave} />
      </View>

      {/* SEGURIDAD */}
      <View style={s.card}>
        <Text style={s.sectionTitle}>Seguridad</Text>

        <TextInput
          label="Contraseña actual"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
        <TextInput
          label="Nueva contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          label="Confirmar nueva"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button title="Cambiar contraseña" onPress={onChangePassword} />
      </View>

      {/* LOGOUT */}
      <View style={s.logoutContainer}>
        <Button
          title="Cerrar sesión"
          onPress={onLogout}
          style={{ backgroundColor: '#C8102E' } as any}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#00205B', // 🔵 Azul EPN
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',

    // sombra ligera
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
    color: '#00205B', // 🔵 Azul EPN
  },

  logoutContainer: {
    marginTop: 10,
  },
});