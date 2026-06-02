import { View, StyleSheet } from 'react-native';
import { EmailVerificationScreen } from '@/features/auth/presentation/email-verification';

export default function VerifyScreen() {
  return (
    <View style={styles.container}>
      <EmailVerificationScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
