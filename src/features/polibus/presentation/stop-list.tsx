import React, { memo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { BusStop } from '@/features/polibus/domain/route.entity';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

interface StopListProps {
  stops: BusStop[];
  onStopPress?: (stop: BusStop, index: number) => void;
  routeColor: string;
}

export const StopList = memo(function StopList({
  stops,
  onStopPress,
  routeColor,
}: StopListProps) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🅿️ Paradas oficiales</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {stops.map((stop, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === stops.length - 1;

          return (
            <TouchableOpacity
              key={stop.id}
              style={styles.card}
              onPress={() => onStopPress?.(stop, idx)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.numberCircle,
                  {
                    backgroundColor: isFirst
                      ? '#059669'
                      : isLast
                        ? '#DC2626'
                        : routeColor,
                  },
                ]}
              >
                <Text style={styles.numberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.name} numberOfLines={2}>
                {stop.name}
              </Text>
              {isFirst && <Text style={styles.label}>Inicio</Text>}
              {isLast && <Text style={styles.label}>Fin</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: T.textPrimary,
  },
  scroll: {
    gap: 8,
    paddingRight: 8,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 10,
    width: 110,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 12,
    fontWeight: '800',
    color: T.surface,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: T.textPrimary,
    textAlign: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: T.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
