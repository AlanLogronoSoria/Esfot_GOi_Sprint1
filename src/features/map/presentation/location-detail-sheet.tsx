import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInUp, FadeOut } from 'react-native-reanimated';
import { getCategoryConfig } from '@/features/map/application/map.hooks';
import type { CampusLocation } from '@/features/map/domain/location.entity';
import { LightTheme as T, Shadows, Sizes, Typography } from '@/constants/design-system';

interface Props { location: CampusLocation | null; onClose: () => void; onNavigate?: (l: CampusLocation) => void; }

export function LocationDetailSheet({ location, onClose, onNavigate }: Props) {
  if (!location) return null;
  const config = getCategoryConfig(location.category);

  return (
    <Animated.View entering={SlideInUp.springify().damping(20).stiffness(200)} exiting={FadeOut.duration(200)} style={s.overlay}>
      <TouchableOpacity style={s.backdrop} onPress={onClose} activeOpacity={1} />
      <Animated.View entering={FadeIn.delay(100)} style={s.sheet}>
        <View style={s.handle} />
        <View style={s.header}>
          <View style={[s.icon, { backgroundColor: config.color + '25' }]}><Text style={s.iconEmoji}>{config.icon}</Text></View>
          <View style={s.headerT}>
            <Text style={s.title}>{location.name}</Text>
            <View style={[s.badge, { backgroundColor: config.color + '20' }]}><Text style={[s.badgeT, { color: config.color }]}>{config.label}</Text></View>
          </View>
        </View>
        {location.description && <Text style={s.desc}>{location.description}</Text>}
        <View style={s.coords}><Text style={s.coordT}>{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</Text></View>
        {onNavigate && (
          <TouchableOpacity style={s.navBtn} onPress={() => onNavigate(location)} activeOpacity={0.8}>
            <Text style={s.navIcon}>🧭</Text><Text style={s.navT}>Cómo llegar</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, justifyContent: 'flex-end', zIndex: 200 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)' },
  sheet: { backgroundColor: T.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Sizes.paddingLg, paddingTop: 12, gap: 16, ...Shadows.lg },
  handle: { width: 36, height: 5, borderRadius: 3, backgroundColor: T.textMuted, alignSelf: 'center', marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  iconEmoji: { fontSize: 24 },
  headerT: { flex: 1, gap: 4 },
  title: { ...Typography.h4, color: T.textPrimary },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  badgeT: { fontSize: 12, fontWeight: '600' },
  desc: { ...Typography.body, color: T.textSecondary },
  coords: { backgroundColor: T.inputBg, borderRadius: 8, padding: 10 },
  coordT: { ...Typography.caption, color: T.textTertiary, fontFamily: 'monospace', textAlign: 'center' },
  navBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: T.primary, borderRadius: 12, padding: 14 },
  navIcon: { fontSize: 18 },
  navT: { ...Typography.button, color: '#FFFFFF' },
});
