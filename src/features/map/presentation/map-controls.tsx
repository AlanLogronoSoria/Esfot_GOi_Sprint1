import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

interface MapControlsProps { onZoomIn: () => void; onZoomOut: () => void; onMyLocation: () => void; onToggleTraffic?: () => void; trafficEnabled?: boolean; isLocating?: boolean; }

export function MapControls({ onZoomIn, onZoomOut, onMyLocation, onToggleTraffic, trafficEnabled, isLocating }: MapControlsProps) {
  return (
    <View style={s.c}>
      <TouchableOpacity style={s.b} onPress={onZoomIn} activeOpacity={0.7}><Text style={s.bt}>+</Text></TouchableOpacity>
      <TouchableOpacity style={s.b} onPress={onZoomOut} activeOpacity={0.7}><Text style={s.bt}>−</Text></TouchableOpacity>
      <View style={s.d} />
      <TouchableOpacity style={[s.b, isLocating && s.ba]} onPress={onMyLocation} activeOpacity={0.7}><Text style={s.bt}>⊙</Text></TouchableOpacity>
      {onToggleTraffic && <><View style={s.d} /><TouchableOpacity style={[s.b, trafficEnabled && s.ba]} onPress={onToggleTraffic} activeOpacity={0.7}><Text style={s.bt}>🚦</Text></TouchableOpacity></>}
    </View>
  );
}

const s = StyleSheet.create({
  c: { backgroundColor: T.surface, borderRadius: 14, padding: 4, gap: 2, ...Shadows.md },
  b: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: T.surface },
  ba: { backgroundColor: T.primaryMuted },
  bt: { fontSize: 20, fontWeight: '600', color: T.textSecondary },
  d: { height: 1, backgroundColor: T.divider, marginHorizontal: 8 },
});
