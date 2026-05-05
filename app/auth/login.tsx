import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/hooks/useAuth';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      if (!email.includes('@epn.edu.ec')) {
        setError('Correo institucional requerido');
        return;
      }

      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Iniciar sesión</ThemedText>

      <TextInput
        placeholder="Correo institucional"
        style={[styles.input, error && styles.inputError]}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={[styles.input, error && styles.inputError]}
        value={password}
        onChangeText={setPassword}
      />

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <Pressable style={styles.button} onPress={handleLogin}>
        <ThemedText style={styles.buttonText}>Ingresar</ThemedText>
      </Pressable>

      <Link href="/auth/register">
        <ThemedText style={styles.link}>Crear cuenta</ThemedText>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 24, justifyContent: 'center' },

  title: { fontSize: 28, fontWeight: 'bold', color: '#00205B', marginBottom: 30 },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  inputError: { borderColor: '#C8102E' },

  button: {
    backgroundColor: '#00205B',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },

  buttonText: { color: '#FFF', fontWeight: 'bold' },

  error: { color: '#C8102E', marginBottom: 10 },

  link: { marginTop: 16, textAlign: 'center', color: '#00205B' },
});