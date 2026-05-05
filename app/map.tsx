import { useLocation } from '@/hooks/useLocation';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function LiveMap() {
  const { location } = useLocation();

  const simulatedRoute = [
    { latitude: -0.1815, longitude: -78.4685 },
    { latitude: -0.1816, longitude: -78.4686 },
    { latitude: -0.1817, longitude: -78.4687 },
  ];

  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: 'Mapa' }} />
      <MapView style={s.map} initialRegion={{ latitude: -0.1815, longitude: -78.4685, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
        {location ? (
          <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="Tú" />
        ) : null}
        <Polyline coordinates={simulatedRoute as any} strokeColor="#0a7ea4" strokeWidth={3} />
      </MapView>
    </View>
  );
}

const s = StyleSheet.create({ container: { flex: 1 }, map: { flex: 1 } });
