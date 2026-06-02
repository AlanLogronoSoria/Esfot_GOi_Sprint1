import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ExpressLoginForm } from '@/features/admin/presentation/express-login-form';

export default function ExpressAuthScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const selectedRole = role === 'admin' ? 'admin' : 'estudiante';

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <ExpressLoginForm role={selectedRole} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
});
