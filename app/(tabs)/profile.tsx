import { View, StyleSheet, ScrollView } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { ProfileForm } from '@/features/profile/presentation/profile-form';
import { DarkTheme as T, Sizes } from '@/constants/design-system';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (isInitialized && !user) return <Redirect href="/auth/login" />;
  if (!user) return null;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <ProfileForm />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.background },
  content: { padding: Sizes.paddingMd },
});
