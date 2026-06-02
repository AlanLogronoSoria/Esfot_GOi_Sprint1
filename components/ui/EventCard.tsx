import React, { useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ImageBackground, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';
import type { Event } from '@/features/events/domain/event.entity';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - Sizes.paddingMd * 2;

const MONTHS = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

const CATEGORY_LABEL: Record<string, string> = {
  academico: 'Academico',
  cultural: 'Cultural',
  deportivo: 'Deportes',
  tecnologico: 'Software & Tech',
  institucional: 'Institucional',
};

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function EventCard({ event, onPress, onAction, actionLabel }: EventCardProps) {
  const date = new Date(event.startDate);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()] ?? '';
  const category = CATEGORY_LABEL[event.category ?? ''] ?? event.category ?? 'Evento';

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const handleAction = useCallback(() => {
    onAction?.();
  }, [onAction]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <ImageBackground
        source={
          event.imageUrl
            ? { uri: event.imageUrl }
            : require('@/assets/images/partial-react-logo.png')
        }
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
          <View style={styles.dateBadge}>
            <Text style={styles.dateMonth}>{month}</Text>
            <Text style={styles.dateDay}>{day}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.category} numberOfLines={1}>
              {category.toUpperCase()}
            </Text>
            <Text style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location} numberOfLines={1}>
                {event.location ?? 'EPN'}
              </Text>
            </View>

            {actionLabel && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleAction}
                activeOpacity={0.85}
              >
                <Text style={styles.actionText}>{actionLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    borderRadius: Sizes.radiusXl,
    overflow: 'hidden',
    marginBottom: Sizes.gapLg,
    alignSelf: 'center',
    ...Shadows.lg,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  imageStyle: {
    borderRadius: Sizes.radiusXl,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Sizes.paddingLg,
  },
  dateBadge: {
    position: 'absolute',
    top: Sizes.paddingMd,
    left: Sizes.paddingMd,
    backgroundColor: T.surfaceGlass,
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: Sizes.paddingSm,
    paddingVertical: Sizes.paddingXs,
    alignItems: 'center',
    minWidth: 48,
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: '700',
    color: T.primary,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '800',
    color: T.textPrimary,
  },
  content: {
    gap: 4,
    marginTop: 4,
  },
  category: {
    ...Typography.label,
    color: T.highlight,
    letterSpacing: 1.5,
  },
  title: {
    ...Typography.h4,
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationIcon: {
    fontSize: 11,
  },
  location: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  actionBtn: {
    backgroundColor: T.accent,
    borderRadius: Sizes.radiusSm,
    paddingVertical: Sizes.paddingSm,
    alignItems: 'center',
    marginTop: Sizes.gapSm,
  },
  actionText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 14,
  },
});
