import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function Recover() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const onRecover = async () => {
    // Simulate sending recovery email
    await new Promise((r) => setTimeout(r, 700));
    Alert.alert('Enviado', 'Se ha enviado un enlace de recuperación a su correo.');
    router.replace('/auth/login');
  };

  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: 'Recuperar contraseña' }} />
      <Text style={s.h1}>Recuperar contraseña</Text>
      <TextInput label="Email institucional" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Button title="Enviar enlace" onPress={onRecover} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#c8102e' },
});
