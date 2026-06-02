import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import type { LocationObject } from 'expo-location';

interface UserMarkerProps {
  location: LocationObject;
  showHeading?: boolean;
}

export const UserMarker = memo(
  function UserMarker({ location, showHeading = true }: UserMarkerProps) {
    const { latitude, longitude, heading } = location.coords;

    return (
      <Marker
        coordinate={{ latitude, longitude }}
        title="Mi ubicación"
        rotation={showHeading ? (heading ?? 0) : 0}
        anchor={{ x: 0.5, y: 0.5 }}
        tracksViewChanges={false}
        flat
      >
        <View style={styles.outer}>
          <View style={styles.inner}>
            <View style={styles.dot} />
          </View>
          <View style={styles.arrow} />
        </View>
      </Marker>
    );
  },
  (prev, next) =>
    prev.location.coords.latitude === next.location.coords.latitude &&
    prev.location.coords.longitude === next.location.coords.longitude &&
    prev.location.coords.heading === next.location.coords.heading
);

const styles = StyleSheet.create({
  outer: {
    width: 28,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 32, 91, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00205B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#00205B',
    marginTop: -1,
  },
});
