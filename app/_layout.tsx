import { AuthProvider } from '@/hooks/useAuth';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* Redirect inicial */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Auth */}
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" />

        {/* App */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modal (NO se abre solo) */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal' }}
        />
      </Stack>
    </AuthProvider>
  );
}