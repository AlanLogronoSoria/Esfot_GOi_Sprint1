import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';

interface LocationCardProps {
  location?: { latitude: number; longitude: number } | null;
}

const CAMPUS_BUILDINGS = [
  { name: 'Edificio de Sistemas', code: 'ESFOT' },
  { name: 'Laboratorio de Redes', code: 'LAB-R' },
  { name: 'Auditorio Principal', code: 'AUD' },
  { name: 'Canchas Polideportivas', code: 'DEP' },
];

export function LocationCard({ location }: LocationCardProps) {
  return (
    <Link href="/map" asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>📍</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>
              {location ? 'Tu ubicacion' : 'Campus EPN'}
            </Text>
            <Text style={styles.subtitle}>
              {location
                ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                : 'Explora el mapa del campus'
              }
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </View>

        <View style={styles.buildingsRow}>
          {CAMPUS_BUILDINGS.map((b) => (
            <View key={b.code} style={styles.buildingTag}>
              <Text style={styles.buildingName} numberOfLines={1}>{b.name}</Text>
              <Text style={styles.buildingCode}>{b.code}</Text>
            </View>
          ))}
        </View>

        <View style={styles.mapBar}>
          <Text style={styles.mapBarText}>Ver mapa del campus</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingLg,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
    gap: Sizes.gapMd,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: T.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  title: { ...Typography.h4, color: T.textPrimary },
  subtitle: { ...Typography.bodySm, color: T.textSecondary },
  arrow: { fontSize: 20, color: T.textTertiary },
  buildingsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buildingTag: {
    backgroundColor: T.neutralMuted,
    borderRadius: Sizes.radiusSm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buildingName: {
    fontSize: 11,
    fontWeight: '600',
    color: T.textSecondary,
    maxWidth: 100,
  },
  buildingCode: {
    fontSize: 10,
    fontWeight: '700',
    color: T.primary,
  },
  mapBar: {
    backgroundColor: T.primaryMuted,
    borderRadius: Sizes.radiusSm,
    padding: Sizes.paddingSm,
    alignItems: 'center',
  },
  mapBarText: {
    ...Typography.caption,
    color: T.primary,
    fontWeight: '700',
  },
});
