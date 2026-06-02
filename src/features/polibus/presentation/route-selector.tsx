import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { BusRoute, BusStop } from '@/features/polibus/domain/route.entity';
import { DarkTheme as T } from '@/constants/design-system';

interface RouteSelectorProps {
  routes: BusRoute[];
  selectedRouteId: string | null;
  stops?: BusStop[];
  onSelectRoute: (route: BusRoute) => void;
}

export const RouteSelector = memo(function RouteSelector({
  routes,
  selectedRouteId,
  stops,
  onSelectRoute,
}: RouteSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutas del Polibús</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const routeStops = isSelected ? stops : undefined;

          return (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.card,
                isSelected && { borderColor: route.color, backgroundColor: route.color + '10' },
              ]}
              onPress={() => onSelectRoute(route)}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <View style={[styles.dot, { backgroundColor: route.color }]} />
                <Text style={styles.cardRoute}>Ruta</Text>
              </View>
              <Text style={styles.cardName} numberOfLines={2}>
                {route.name}
              </Text>
              <View style={styles.cardEndpoints}>
                <View style={styles.endpointRow}>
                  <View style={[styles.endpointDot, { backgroundColor: '#059669' }]} />
                  <Text style={styles.endpointText} numberOfLines={1}>
                    {routeStops?.[0]?.name ?? 'Inicio'}
                  </Text>
                </View>
                <View style={styles.endpointArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
                <View style={styles.endpointRow}>
                  <View style={[styles.endpointDot, { backgroundColor: '#DC2626' }]} />
                  <Text style={styles.endpointText} numberOfLines={1}>
                    {routeStops?.[routeStops.length - 1]?.name ?? 'Fin'}
                  </Text>
                </View>
              </View>
              {stops && isSelected && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{stops.length} paradas</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: T.textPrimary,
  },
  scroll: {
    gap: 10,
    paddingRight: 8,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 14,
    width: 170,
    gap: 8,
    borderWidth: 2,
    borderColor: T.cardBorder,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardRoute: {
    fontSize: 10,
    fontWeight: '700',
    color: T.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: T.textPrimary,
  },
  cardEndpoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  endpointRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  endpointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  endpointText: {
    fontSize: 10,
    color: T.textSecondary,
    flex: 1,
  },
  endpointArrow: {
    paddingHorizontal: 2,
  },
  arrowText: {
    fontSize: 12,
    color: T.textTertiary,
  },
  badge: {
    backgroundColor: T.primaryMuted,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: T.primary,
  },
});
