import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const routes = [
  {
    id: 'r1',
    coords: [
      { latitude: -0.180653, longitude: -78.467834 },
      { latitude: -0.181653, longitude: -78.468834 },
      { latitude: -0.182653, longitude: -78.469834 },
    ],
  },
];

const stops = [
  { id: 's1', title: 'Parada 1', latitude: -0.180653, longitude: -78.467834 },
  { id: 's2', title: 'Parada 2', latitude: -0.182653, longitude: -78.469834 },
];

export default function Polibus() {
  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: 'Polibus' }} />
      <MapView style={s.map} initialRegion={{ latitude: -0.1815, longitude: -78.4685, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
        {routes.map((r) => (
          <Polyline key={r.id} coordinates={r.coords as any} strokeColor="#c8102e" strokeWidth={4} />
        ))}
        {stops.map((p) => (
          <Marker key={p.id} coordinate={{ latitude: p.latitude, longitude: p.longitude }} title={p.title} />
        ))}
      </MapView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
