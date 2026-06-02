import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { isDevMode } from '@/core/config/env';

export default function IndexRedirect() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00205B" />
        <Text style={styles.loadingText}>Cargando EsfotGo...</Text>
      </View>
    );
  }

  if (isDevMode() && !user) {
    return <Redirect href="/auth/dev-login" />;
  }

  if (user) {
    return <Redirect href="/(drawer)" />;
  }

  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
