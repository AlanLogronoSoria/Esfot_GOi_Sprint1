import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useAuth } from '@/hooks/useAuth';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

const INSTITUTION_DOMAIN = '@esfot.edu.ec';

export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.endsWith(INSTITUTION_DOMAIN)) {
      Alert.alert('Email inválido', `Use su correo institucional (${INSTITUTION_DOMAIN})`);
      return false;
    }
    if (password.length < 8) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (password !== confirm) {
      Alert.alert('Contrificación', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const onRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: 'Registro' }} />
      <Text style={s.h1}>Crea tu cuenta</Text>
      <TextInput label="Email institucional" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput label="Confirmar contraseña" value={confirm} onChangeText={setConfirm} secureTextEntry />
      <Button title={loading ? 'Creando...' : 'Crear cuenta'} onPress={onRegister} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#c8102e' },
});
