import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { getCategoryConfig } from '@/features/map/application/map.hooks';
import type { MapMarkerData } from '@/features/map/domain/coordinates';

interface LocationMarkerProps {
  marker: MapMarkerData;
  onPress?: (marker: MapMarkerData) => void;
  tracksViewChanges?: boolean;
}

export const LocationMarker = memo(function LocationMarker({
  marker,
  onPress,
  tracksViewChanges = false,
}: LocationMarkerProps) {
  const config = getCategoryConfig(marker.category);

  return (
    <Marker
      coordinate={marker.coordinate}
      title={marker.title}
      description={marker.description}
      tracksViewChanges={tracksViewChanges}
      onPress={() => onPress?.(marker)}
    >
      <View style={[styles.markerContainer, { backgroundColor: config.color }]}>
        <Text style={styles.markerIcon}>{config.icon}</Text>
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{marker.title}</Text>
          {marker.description && (
            <Text style={styles.calloutDesc} numberOfLines={3}>
              {marker.description}
            </Text>
          )}
          <View style={styles.calloutBadge}>
            <Text style={styles.calloutBadgeText}>{config.label}</Text>
          </View>
        </View>
      </Callout>
    </Marker>
  );
});

interface ClusterMarkerProps {
  id: string;
  coordinate: { latitude: number; longitude: number };
  count: number;
  topCategory: string;
  onPress?: () => void;
}

export const ClusterMarker = memo(function ClusterMarker({
  id,
  coordinate,
  count,
  topCategory,
  onPress,
}: ClusterMarkerProps) {
  const config = getCategoryConfig(topCategory);
  const size = Math.min(60, 40 + count * 2);

  return (
    <Marker
      coordinate={coordinate}
      identifier={id}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View
        style={[
          styles.clusterContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: config.color,
          },
        ]}
      >
        <Text style={styles.clusterCount}>{count > 99 ? '99+' : count}</Text>
      </View>
    </Marker>
  );
});

interface BusMarkerProps {
  coordinate: { latitude: number; longitude: number };
  busId: string;
  heading: number;
  routeColor: string;
}

export const BusMarker = memo(function BusMarker({
  coordinate,
  busId,
  heading,
  routeColor,
}: BusMarkerProps) {
  return (
    <Marker
      coordinate={coordinate}
      title={`Bus ${busId}`}
      rotation={heading}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
      flat
    >
      <View style={[styles.busMarker, { backgroundColor: routeColor }]}>
        <Text style={styles.busIcon}>🚌</Text>
      </View>
    </Marker>
  );
});

interface StopMarkerProps {
  coordinate: { latitude: number; longitude: number };
  name: string;
  index: number;
  total: number;
  stopNumber: number;
}

export const StopMarker = memo(function StopMarker({
  coordinate,
  name,
  index,
  total,
  stopNumber,
}: StopMarkerProps) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <Marker
      coordinate={coordinate}
      title={isFirst ? `🏁 Inicio: ${name}` : isLast ? `🏁 Fin: ${name}` : name}
      description={`Parada ${stopNumber} de ${total}`}
      tracksViewChanges={false}
    >
      <View
        style={[
          styles.stopDot,
          isFirst && styles.stopFirst,
          isLast && styles.stopLast,
        ]}
      >
        <Text
          style={[
            styles.stopNumber,
            (isFirst || isLast) && styles.stopNumberEndpoint,
          ]}
        >
          {stopNumber}
        </Text>
      </View>
    </Marker>
  );
});

const styles = StyleSheet.create({
  markerContainer: {
    padding: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  markerIcon: {
    fontSize: 18,
  },
  callout: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    width: 220,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  calloutDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  calloutBadge: {
    marginTop: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  calloutBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  clusterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  clusterCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  busMarker: {
    padding: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  busIcon: {
    fontSize: 20,
  },
  stopDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6B7280',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  stopNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stopNumberEndpoint: {
    fontSize: 11,
  },
  stopFirst: {
    backgroundColor: '#059669',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  stopLast: {
    backgroundColor: '#DC2626',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
