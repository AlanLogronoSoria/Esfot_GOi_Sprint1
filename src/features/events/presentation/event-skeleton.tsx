import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LightTheme as T } from '@/constants/design-system';

function SBlock({ w, h, st }: { w: number | string; h: number; st?: object }) {
  const op = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(op, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      Animated.timing(op, { toValue: 0.2, duration: 700, useNativeDriver: true }),
    ])); a.start(); return () => a.stop();
  }, [op]);
  return <Animated.View style={[{ width: w, height: h, backgroundColor: T.surface, borderRadius: 8, opacity: op }, st]} />;
}

export function EventCardSkeleton() {
  return (
    <View style={s.card}>
      <SBlock h={160} w="100%" st={s.img} />
      <View style={s.body}>
        <SBlock h={20} w="80%" />
        <SBlock h={14} w="55%" />
        <View style={s.row}>
          <SBlock h={14} w={90} />
          <SBlock h={14} w={60} />
        </View>
        <SBlock h={14} w="40%" />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: T.surfaceGlass, borderRadius: 14, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: T.cardBorder },
  img: { width: '100%' },
  body: { padding: 16, gap: 10 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
});
