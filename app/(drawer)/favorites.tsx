import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LightTheme as T, Sizes, Typography } from '@/constants/design-system';

export default function FavoritesScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.emoji}>⭐</Text>
        <Text style={s.title}>Favoritos</Text>
        <Text style={s.subtitle}>Pantalla en construccion</Text>

        <TouchableOpacity
          style={s.btn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={s.btnText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  content: {
    flexGrow: 1,
    padding: Sizes.paddingXl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizes.gapMd,
  },
  emoji: { fontSize: 48 },
  title: { ...Typography.h2, color: T.textPrimary },
  subtitle: { ...Typography.body, color: T.textSecondary },
  btn: {
    backgroundColor: T.primary,
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  btnText: { ...Typography.button, color: '#FFFFFF' },
});
