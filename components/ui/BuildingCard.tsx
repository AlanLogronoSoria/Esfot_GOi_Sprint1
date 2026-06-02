import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';

export interface Building {
  id: string;
  name: string;
  code?: string;
  description?: string;
  category: 'edificio' | 'aula' | 'laboratorio' | 'oficina' | 'otro';
  floor?: number;
  capacity?: number;
  icon?: string;
  isFavorite?: boolean;
}

interface BuildingCardProps {
  building: Building;
  onPress?: () => void;
  onMapPress?: () => void;
  onFavoritePress?: () => void;
  animationDelay?: number;
}

const CATEGORY_CONFIG: Record<Building['category'], { icon: string; label: string; color: string }> = {
  edificio: { icon: '🏫', label: 'Edificio', color: '#042c5c' },
  aula: { icon: '📚', label: 'Aula', color: '#1a4a8a' },
  laboratorio: { icon: '🔬', label: 'Laboratorio', color: '#059669' },
  oficina: { icon: '🏢', label: 'Oficina', color: '#827372' },
  otro: { icon: '📍', label: 'Otro', color: '#fabb54' },
};

export function BuildingCard({
  building,
  onPress,
  onMapPress,
  onFavoritePress,
  animationDelay = 0,
}: BuildingCardProps) {
  const cfg = CATEGORY_CONFIG[building.category];

  return (
    <Animated.View entering={FadeInDown.delay(animationDelay).duration(400)}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.92}
      >
        {/* Left icon */}
        <View style={[styles.iconWrap, { backgroundColor: cfg.color + '14' }]}>
          <Text style={styles.iconEmoji}>{building.icon ?? cfg.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={[styles.categoryBadge, { backgroundColor: cfg.color + '14' }]}>
              <Text style={[styles.categoryText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
            {building.code && (
              <Text style={styles.code}>{building.code}</Text>
            )}
          </View>
          <Text style={styles.name} numberOfLines={1}>{building.name}</Text>
          {building.description && (
            <Text style={styles.description} numberOfLines={2}>{building.description}</Text>
          )}
          <View style={styles.metaRow}>
            {building.floor !== undefined && (
              <Text style={styles.meta}>🏢 Piso {building.floor}</Text>
            )}
            {building.capacity !== undefined && (
              <Text style={styles.meta}>👥 Cap. {building.capacity}</Text>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {onFavoritePress && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onFavoritePress}
              hitSlop={8}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>{building.isFavorite ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          )}
          {onMapPress && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.mapBtn]}
              onPress={onMapPress}
              activeOpacity={0.8}
            >
              <Text style={styles.mapBtnText}>Ver</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingMd,
    marginBottom: Sizes.gapMd,
    gap: 12,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: { fontSize: 24 },
  content: { flex: 1, gap: 4 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  code: {
    fontSize: 11,
    color: T.textTertiary,
    fontWeight: '600',
  },
  name: {
    ...Typography.h4,
    color: T.textPrimary,
    fontSize: 15,
  },
  description: {
    ...Typography.bodySm,
    color: T.textSecondary,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  meta: {
    fontSize: 11,
    color: T.textTertiary,
  },
  actions: {
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: T.inputBg,
  },
  actionIcon: { fontSize: 16 },
  mapBtn: {
    backgroundColor: T.primary,
    paddingHorizontal: 10,
    width: 'auto' as any,
  },
  mapBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
