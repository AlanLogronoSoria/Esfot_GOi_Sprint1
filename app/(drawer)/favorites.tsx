import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';
import { GlassHeader } from '@/components/ui/GlassHeader';
import { BuildingCard, type Building } from '@/components/ui/BuildingCard';
import { RouteCard, type Route } from '@/components/ui/RouteCard';
import { EmptyState } from '@/components/ui/EmptyState';

type FavTab = 'aulas' | 'edificios' | 'rutas' | 'ubicaciones';

const TABS: { key: FavTab; label: string; icon: string }[] = [
  { key: 'aulas', label: 'Aulas', icon: '📚' },
  { key: 'edificios', label: 'Edificios', icon: '🏫' },
  { key: 'rutas', label: 'Rutas', icon: '🗺️' },
  { key: 'ubicaciones', label: 'Ubicaciones', icon: '📍' },
];

// ─── Mock data ───
const MOCK_AULAS: Building[] = [
  {
    id: '1',
    name: 'Aula 101 - Matemáticas',
    code: 'A-101',
    description: 'Laboratorio de computación con 40 equipos de última generación',
    category: 'aula',
    floor: 1,
    capacity: 40,
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Aula 205 - Tecnología',
    code: 'A-205',
    description: 'Sala de clase equipada con proyector y sistema de audio',
    category: 'aula',
    floor: 2,
    capacity: 35,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Laboratorio de Redes',
    code: 'L-304',
    description: 'Laboratorio especializado en redes y telecomunicaciones',
    category: 'laboratorio',
    floor: 3,
    capacity: 25,
    isFavorite: true,
  },
];

const MOCK_EDIFICIOS: Building[] = [
  {
    id: 'e1',
    name: 'Edificio Principal ESFOT',
    code: 'EP-01',
    description: 'Edificio central con aulas, secretaría y dirección académica',
    category: 'edificio',
    isFavorite: true,
  },
  {
    id: 'e2',
    name: 'Bloque de Laboratorios',
    code: 'BL-02',
    description: 'Complejo de laboratorios de ingeniería y tecnología',
    category: 'edificio',
    isFavorite: true,
  },
];

const MOCK_RUTAS: Route[] = [
  {
    id: 'r1',
    name: 'Ruta al Edificio ESFOT',
    origin: 'Mi ubicación',
    destination: 'Edificio Principal ESFOT',
    distanceMeters: 320,
    estimatedMinutes: 4,
    isActive: true,
    color: '#042c5c',
    icon: '🚶',
  },
  {
    id: 'r2',
    name: 'Ruta al Laboratorio',
    origin: 'Entrada EPN',
    destination: 'Bloque de Laboratorios',
    distanceMeters: 580,
    estimatedMinutes: 7,
    isActive: true,
    color: '#059669',
    icon: '🗺️',
  },
];

const MOCK_UBICACIONES: Building[] = [
  {
    id: 'u1',
    name: 'Cafetería Central',
    description: 'Área de alimentación principal del campus',
    category: 'otro',
    icon: '☕',
    isFavorite: true,
  },
  {
    id: 'u2',
    name: 'Biblioteca EPN',
    description: 'Centro de recursos bibliográficos y digitales',
    category: 'otro',
    icon: '📖',
    isFavorite: true,
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FavTab>('aulas');
  const [favorites, setFavorites] = useState({
    aulas: MOCK_AULAS,
    edificios: MOCK_EDIFICIOS,
    rutas: MOCK_RUTAS,
    ubicaciones: MOCK_UBICACIONES,
  });

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const totalFavs =
    favorites.aulas.length +
    favorites.edificios.length +
    favorites.rutas.length +
    favorites.ubicaciones.length;

  const removeFavorite = useCallback((tab: FavTab, id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [tab]: (prev[tab] as any[]).filter((item: any) => item.id !== id),
    }));
  }, []);

  const renderContent = () => {
    if (activeTab === 'rutas') {
      const routes = favorites.rutas;
      if (routes.length === 0) {
        return (
          <EmptyState
            icon="🗺️"
            title="Sin rutas favoritas"
            subtitle="Guarda rutas desde el Mapa para acceder rápidamente"
            actionLabel="Ir al Mapa"
            onAction={() => router.push('/map' as any)}
            delay={100}
          />
        );
      }
      return (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.list}>
          {routes.map((route, i) => (
            <RouteCard
              key={route.id}
              route={route}
              isFavorite
              onPress={() => router.push('/map' as any)}
              onFavoritePress={() => removeFavorite('rutas', route.id)}
              animationDelay={i * 60}
            />
          ))}
        </Animated.View>
      );
    }

    const items =
      activeTab === 'aulas'
        ? favorites.aulas
        : activeTab === 'edificios'
        ? favorites.edificios
        : favorites.ubicaciones;

    if (items.length === 0) {
      const config: Record<FavTab, { icon: string; title: string; subtitle: string; action: string }> = {
        aulas: { icon: '📚', title: 'Sin aulas favoritas', subtitle: 'Agrega aulas desde el Mapa', action: 'Ir al Mapa' },
        edificios: { icon: '🏫', title: 'Sin edificios favoritos', subtitle: 'Explora el campus en el Mapa', action: 'Explorar' },
        rutas: { icon: '🗺️', title: 'Sin rutas', subtitle: '', action: '' },
        ubicaciones: { icon: '📍', title: 'Sin ubicaciones', subtitle: 'Guarda lugares frecuentes desde el Mapa', action: 'Ir al Mapa' },
      };
      const c = config[activeTab];
      return (
        <EmptyState
          icon={c.icon}
          title={c.title}
          subtitle={c.subtitle}
          actionLabel={c.action}
          onAction={() => router.push('/map' as any)}
          delay={100}
        />
      );
    }

    return (
      <Animated.View entering={FadeInDown.duration(400)} style={styles.list}>
        {items.map((item, i) => (
          <BuildingCard
            key={item.id}
            building={item as Building}
            onPress={() => router.push('/map' as any)}
            onMapPress={() => router.push('/map' as any)}
            onFavoritePress={() => removeFavorite(activeTab, item.id)}
            animationDelay={i * 60}
          />
        ))}
      </Animated.View>
    );
  };

  return (
    <View style={styles.root}>
      <GlassHeader
        scrollY={scrollY}
        onAvatarPress={() => router.push('/profile' as any)}
      />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Favoritos</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{totalFavs}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            Tus aulas, edificios y rutas guardadas
          </Text>
        </Animated.View>

        {/* Tabs */}
        <Animated.View entering={FadeInDown.delay(80)} style={styles.tabsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            {TABS.map((tab) => {
              const count = (favorites[tab.key] as any[]).length;
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                  {count > 0 && (
                    <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                      <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                        {count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Content */}
        {renderContent()}

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  scroll: { flex: 1 },
  content: { paddingTop: 8 },

  header: {
    paddingHorizontal: Sizes.paddingMd,
    paddingTop: 72,
    paddingBottom: Sizes.gapSm,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: { ...Typography.h2, color: T.textPrimary },
  countBadge: {
    backgroundColor: T.primaryMuted,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: { fontSize: 14, fontWeight: '700', color: T.primary },
  subtitle: { ...Typography.body, color: T.textSecondary },

  tabsWrap: { marginBottom: Sizes.gapMd },
  tabs: {
    paddingHorizontal: Sizes.paddingMd,
    gap: 8,
    paddingVertical: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Sizes.radiusFull,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  tabActive: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  tabIcon: { fontSize: 14 },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSecondary,
  },
  tabLabelActive: { color: '#FFFFFF' },
  tabBadge: {
    backgroundColor: T.primaryMuted,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: T.primary,
  },
  tabBadgeTextActive: { color: '#FFFFFF' },

  list: {
    paddingHorizontal: Sizes.paddingMd,
    paddingTop: 4,
  },
});
