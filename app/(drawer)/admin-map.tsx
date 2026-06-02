import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from 'react-native-maps';
import type { MapRegion } from '@/features/map/domain/coordinates';
import type { CampusLocation } from '@/features/map/domain/location.entity';
import { LocationMarker } from '@/features/map/presentation/markers';
import { PoiForm } from '@/features/admin/presentation/poi-form';
import { useAdminPois, useAdminZones } from '@/features/admin/application/poi.hooks';
import { poiEventBus } from '@/features/admin/application/poi-events';
import type { PoiInput, PoiUpdateInput } from '@/features/admin/domain/poi.entity';
import { useAuthStore } from '@/store/auth.store';
import { DarkTheme as T, Shadows } from '@/constants/design-system';

const EPN_REGION: MapRegion = {
  latitude: -0.2095, longitude: -78.4905,
  latitudeDelta: 0.012, longitudeDelta: 0.012,
};

export default function AdminMapScreen() {
  const role = useAuthStore((s) => s.user?.role);
  const mapRef = useRef<MapView>(null);
  const { pois, isLoading, createPoi, updatePoi, deletePoi } = useAdminPois();
  const { zones } = useAdminZones();

  const [editMode, setEditMode] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<CampusLocation | null>(null);
  const [newCoordinate, setNewCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  const handleMapLongPress = useCallback(
    (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
      if (!editMode) return;
      setNewCoordinate(e.nativeEvent.coordinate);
      setSelectedPoi(null);
      setPanelVisible(true);
    }, [editMode]);

  const handleMarkerPress = useCallback(
    (poi: CampusLocation) => {
      if (!editMode) return;
      setSelectedPoi(poi);
      setNewCoordinate(null);
      setPanelVisible(true);
    }, [editMode]);

  const handleCreate = useCallback((input: PoiInput) => {
    createPoi.mutateAsync(input).then(() => { setPanelVisible(false); setNewCoordinate(null); });
  }, [createPoi]);

  const handleUpdate = useCallback((id: string, input: PoiUpdateInput) => {
    updatePoi.mutateAsync({ id, input }).then(() => { setPanelVisible(false); setSelectedPoi(null); });
  }, [updatePoi]);

  const handleDelete = useCallback((poi: CampusLocation) => {
    Alert.alert('Eliminar ubicación', `¿Eliminar "${poi.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { deletePoi.mutateAsync(poi.id); setPanelVisible(false); setSelectedPoi(null); } },
    ]);
  }, [deletePoi]);

  if (role !== 'administrador') {
    return (
      <View style={gateStyles.container}>
        <Text style={gateStyles.icon}>🔒</Text>
        <Text style={gateStyles.title}>Acceso restringido</Text>
        <Text style={gateStyles.desc}>Esta sección solo está disponible para administradores.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={EPN_REGION}
        onLongPress={handleMapLongPress}
        showsUserLocation
        toolbarEnabled={false}
      >
        {pois.map((poi) => (
          <LocationMarker
            key={poi.id}
            marker={{
              id: poi.id,
              coordinate: { latitude: poi.latitude, longitude: poi.longitude },
              title: poi.name,
              description: poi.description ?? undefined,
              category: poi.category,
              clusterWeight: 1,
            }}
            onPress={() => handleMarkerPress(poi)}
          />
        ))}

        {zones
          .filter((z) => z.isActive)
          .map((zone) => (
            <Polygon
              key={zone.id}
              coordinates={zone.coordinates}
              fillColor={zone.fillColor}
              strokeColor={zone.strokeColor}
              strokeWidth={2}
            />
          ))}

        {newCoordinate && (
          <Marker
            coordinate={newCoordinate}
            pinColor="#FFB81C"
            title="Nueva ubicación"
          />
        )}
      </MapView>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolbarBtn, editMode && styles.toolbarBtnActive]}
          onPress={() => {
            setEditMode(!editMode);
            setPanelVisible(false);
            setSelectedPoi(null);
            setNewCoordinate(null);
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.toolbarBtnText, editMode && styles.toolbarBtnTextActive]}>
            {editMode ? '✏️ Editando' : '✏️ Editar'}
          </Text>
        </TouchableOpacity>
        {editMode && (
          <Text style={styles.hint}>Mantén presionado el mapa para agregar un POI</Text>
        )}
      </View>

      {isLoading && (
        <ActivityIndicator
          size="large"
          color={T.primary}
          style={styles.loader}
        />
      )}

      {/* POI list */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Ubicaciones ({pois.length})</Text>
          <PoiEventCounter />
        </View>

        <FlatList
          data={pois}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.poiItem, selectedPoi?.id === item.id && styles.poiItemSelected]}
              onPress={() => {
                setSelectedPoi(item);
                setNewCoordinate(null);
                setPanelVisible(true);
                mapRef.current?.animateToRegion(
                  { latitude: item.latitude, longitude: item.longitude, latitudeDelta: 0.004, longitudeDelta: 0.004 },
                  400
                );
              }}
              activeOpacity={0.7}
            >
              <View style={styles.poiItemContent}>
                <Text style={styles.poiItemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.poiItemCat}>{item.category}</Text>
              </View>
              {editMode && (
                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  hitSlop={8}
                  activeOpacity={0.6}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
          style={styles.poiList}
        />
      </View>

      {/* Edit/Add form */}
      {panelVisible && (
        <View style={styles.formOverlay}>
          <View style={styles.formCard}>
            <PoiForm
              initialCoordinate={newCoordinate ?? undefined}
              editingPoi={selectedPoi}
              isLoading={createPoi.isPending || updatePoi.isPending}
              onSubmit={handleCreate}
              onUpdate={handleUpdate}
              onCancel={() => {
                setPanelVisible(false);
                setSelectedPoi(null);
                setNewCoordinate(null);
              }}
            />
            {selectedPoi && (
              <TouchableOpacity
                style={styles.deletePoiBtn}
                onPress={() => handleDelete(selectedPoi)}
                activeOpacity={0.7}
              >
                <Text style={styles.deletePoiText}>Eliminar ubicación</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function PoiEventCounter() {
  const [count, setCount] = useState(0);
  React.useEffect(() => {
    const unsub = poiEventBus.subscribe(() => setCount((c) => c + 1));
    return unsub;
  }, []);
  if (count === 0) return null;
  return (
    <View style={ecStyles.badge}>
      <Text style={ecStyles.text}>🔄 {count}</Text>
    </View>
  );
}

const ecStyles = StyleSheet.create({
  badge: { backgroundColor: T.infoBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  text: { fontSize: 11, fontWeight: '700', color: T.info },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.background },
  map: { flex: 1 },
  toolbar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 100,
  },
  toolbarBtn: {
    backgroundColor: T.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...Shadows.sm,
  },
  toolbarBtnActive: { backgroundColor: T.primary },
  toolbarBtnText: { fontSize: 13, fontWeight: '700', color: T.textPrimary },
  toolbarBtnTextActive: { color: T.surface },
  hint: { fontSize: 11, color: T.textSecondary, flex: 1 },
  loader: { position: 'absolute', top: '50%', alignSelf: 'center' },
  panel: {
    backgroundColor: T.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 14,
    maxHeight: 200,
    ...Shadows.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  panelTitle: { fontSize: 15, fontWeight: '700', color: T.textPrimary },
  poiList: { maxHeight: 140 },
  poiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: T.inputBg,
    justifyContent: 'space-between',
  },
  poiItemSelected: { backgroundColor: T.infoBg, borderWidth: 1, borderColor: T.info },
  poiItemContent: { flex: 1 },
  poiItemName: { fontSize: 13, fontWeight: '600', color: T.textPrimary },
  poiItemCat: { fontSize: 10, color: T.textTertiary },
  deleteIcon: { fontSize: 16 },
  formOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 200,
  },
  formCard: {
    backgroundColor: T.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingTop: 14,
    gap: 10,
    ...Shadows.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  deletePoiBtn: { padding: 12, borderRadius: 10, backgroundColor: T.errorBg, alignItems: 'center', marginTop: 4 },
  deletePoiText: { fontSize: 14, fontWeight: '600', color: T.error },
});

const gateStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: T.background, gap: 12 },
  icon: { fontSize: 48 },
  title: { fontSize: 20, fontWeight: '700', color: T.textPrimary },
  desc: { fontSize: 14, color: T.textSecondary, textAlign: 'center' },
});
