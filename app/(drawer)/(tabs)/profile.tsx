import { View, StyleSheet, ScrollView } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { ProfileForm } from '@/features/profile/presentation/profile-form';
import { LightTheme as T } from '@/constants/design-system';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (isInitialized && !user) return <Redirect href="/auth/login" />;
  if (!user) return null;

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProfileForm />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  scroll: { flex: 1 },
  content: { paddingTop: 64, paddingBottom: 40, paddingHorizontal: 16 },
});
