import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_W = SCREEN_W - Sizes.paddingMd * 2;

const MONTHS = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  date: string;
  imageUrl: string | null;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
  category?: string;
}

export function HeroBanner({
  title,
  subtitle,
  date,
  imageUrl,
  actionLabel,
  actionHref,
  onAction,
  category,
}: HeroBannerProps) {
  const d = new Date(date);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()] ?? '';

  const btn = (
    <TouchableOpacity
      style={styles.cta}
      onPress={onAction}
      activeOpacity={0.85}
    >
      <Text style={styles.ctaText}>{actionLabel}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      <ImageBackground
        source={
          imageUrl
            ? { uri: imageUrl }
            : require('@/assets/images/partial-react-logo.png')
        }
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(4,44,92,0.92)']}
          style={styles.gradient}
        >
          <View style={styles.dateBadge}>
            <Text style={styles.dateMonth}>{month}</Text>
            <Text style={styles.dateDay}>{day}</Text>
          </View>

          <View style={styles.content}>
            {category && (
              <Text style={styles.category}>{category.toUpperCase()}</Text>
            )}
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
            )}
            <View style={styles.actionWrap}>
              {actionHref ? (
                <Link href={actionHref as any} asChild>
                  {btn}
                </Link>
              ) : (
                btn
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: HERO_W,
    height: 280,
    borderRadius: Sizes.radiusXl,
    overflow: 'hidden',
    alignSelf: 'center',
    ...Shadows.lg,
  },
  image: {
    width: '100%',
    height: '100%',
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
    minWidth: 52,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: '700',
    color: T.primary,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontSize: 24,
    fontWeight: '800',
    color: T.textPrimary,
  },
  content: {
    gap: 4,
  },
  category: {
    ...Typography.label,
    color: T.highlight,
    letterSpacing: 1.5,
  },
  title: {
    ...Typography.h2,
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 36,
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.75)',
  },
  actionWrap: {
    marginTop: Sizes.gapSm,
  },
  cta: {
    backgroundColor: T.accent,
    borderRadius: Sizes.radiusSm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
});
