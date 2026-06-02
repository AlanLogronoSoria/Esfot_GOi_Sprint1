import React, { useCallback, useRef, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import type { MapRegion, MapMarkerData, ClusterPoint, GeoCoordinate } from '@/features/map/domain/coordinates';
import type { CampusLocation } from '@/features/map/domain/location.entity';
import { useMapClusters } from '@/features/map/application/map.hooks';
import { useLocation } from '@/hooks/useLocation';
import { UserMarker } from '@/features/map/presentation/user-marker';
import { LocationMarker, ClusterMarker } from '@/features/map/presentation/markers';
import { MapControls } from '@/features/map/presentation/map-controls';
import { CategoryFilter } from '@/features/map/presentation/category-filter';
import { MapSearchBar } from '@/features/map/presentation/map-search-bar';
import { LocationDetailSheet } from '@/features/map/presentation/location-detail-sheet';
import { RouteInfoCard } from '@/features/map/presentation/route-info-card';
import { calculateOptimalRoute } from '@/features/map/services/route-calculator';
import { useBatteryOptimizer } from '@/features/map/services/battery-optimizer';
import type { RouteCalculation } from '@/features/map/services/route-calculator';

const EPN_REGION: MapRegion = {
  latitude: -0.2095,
  longitude: -78.4905,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

function isClusterPoint(item: MapMarkerData | ClusterPoint): item is ClusterPoint {
  return 'count' in item && item.count > 1;
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const { location: userLocation } = useLocation();
  const battery = useBatteryOptimizer();

  const [region, setRegion] = useState<MapRegion>(EPN_REGION);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [route, setRoute] = useState<RouteCalculation | null>(null);

  const { clusters } = useMapClusters(region, selectedCategory);

  const handleRegionChange = useCallback((r: MapRegion) => {
    setRegion(r);
  }, []);

  const handleMarkerPress = useCallback((marker: MapMarkerData) => {
    const location: CampusLocation = {
      id: marker.id,
      name: marker.title,
      description: marker.description ?? null,
      category: marker.category,
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      imageUrl: marker.imageUrl ?? null,
      createdAt: '',
    };
    setSelectedLocation(location);

    if (userLocation) {
      const calc = calculateOptimalRoute(
        { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
        marker.coordinate
      );
      setRoute(calc);
    }
  }, [userLocation]);

  const handleSelectLocation = useCallback((location: CampusLocation) => {
    setSelectedLocation(location);
    const dest: GeoCoordinate = { latitude: location.latitude, longitude: location.longitude };
    mapRef.current?.animateToRegion(
      { ...dest, latitudeDelta: 0.004, longitudeDelta: 0.004 },
      500
    );

    if (userLocation) {
      const calc = calculateOptimalRoute(
        { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
        dest
      );
      setRoute(calc);
    }
  }, [userLocation]);

  const handleClearRoute = useCallback(() => {
    setRoute(null);
    setSelectedLocation(null);
  }, []);

  const handleMyLocation = useCallback(() => {
    if (!userLocation) return;
    setIsLocating(true);
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      600
    );
    setTimeout(() => setIsLocating(false), 1200);
  }, [userLocation]);

  const handleZoomIn = useCallback(() => {
    setRegion((prev) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta / 1.6,
      longitudeDelta: prev.longitudeDelta / 1.6,
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setRegion((prev) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta * 1.6,
      longitudeDelta: prev.longitudeDelta * 1.6,
    }));
  }, []);

  const skipAnimation = useMemo(() => battery.shouldSkipAnimation(), [battery]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={EPN_REGION}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
        toolbarEnabled={false}
        pitchEnabled={false}
      >
        {userLocation && <UserMarker location={userLocation} />}

        {clusters.map((item) => {
          if (isClusterPoint(item)) {
            return (
              <ClusterMarker
                key={item.id}
                id={item.id}
                coordinate={item.coordinate}
                count={item.count}
                topCategory={item.topCategory}
              />
            );
          }
          return (
            <LocationMarker
              key={item.id}
              marker={item}
              onPress={handleMarkerPress}
              tracksViewChanges={!skipAnimation}
            />
          );
        })}

        {route && route.waypoints.length > 1 && (
          <Polyline
            coordinates={route.waypoints}
            strokeColor="#1B6BB0"
            strokeWidth={4}
            lineDashPattern={[8, 6]}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {route && (
          <LocationMarker
            key="route-dest"
            marker={{
              id: 'route-dest',
              coordinate: route.destination,
              title: selectedLocation?.name ?? 'Destino',
              description: `${Math.round(route.distance)}m`,
              category: 'otro',
              clusterWeight: 0,
            }}
            tracksViewChanges={false}
          />
        )}
      </MapView>

      <RouteInfoCard route={route} isVisible={!!route} onClear={handleClearRoute} />

      <View style={styles.searchContainer}>
        <MapSearchBar onSelectLocation={handleSelectLocation} />
      </View>

      <View style={styles.filterContainer}>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      <View style={styles.controlsContainer}>
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onMyLocation={handleMyLocation}
          isLocating={isLocating}
        />
      </View>

      <LocationDetailSheet
        location={selectedLocation}
        onClose={() => {
          setSelectedLocation(null);
          setRoute(null);
        }}
        onNavigate={() => {
          // Route already calculated
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  filterContainer: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  controlsContainer: {
    position: 'absolute',
    right: 12,
    top: 140,
    zIndex: 99,
  },
});
