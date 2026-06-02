import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';
import { useAuthStore } from '@/store/auth.store';
import { UserEntity } from '@/features/auth/domain/user.entity';
import { useInfiniteEvents } from '@/features/events/application/event.hooks';
import { useBusRoutes } from '@/features/polibus/application/bus.hooks';
import { useLocation } from '@/hooks/useLocation';
import { GpsPermissionPrompt } from '@/features/auth/presentation/gps-permission-prompt';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';
import { GlassHeader } from '@/components/ui/GlassHeader';
import { CategoryChip, type Category } from '@/components/ui/CategoryChip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { EventCard } from '@/components/ui/EventCard';
import { TransportCard } from '@/components/ui/TransportCard';
import { LocationCard } from '@/components/ui/LocationCard';

const CATEGORIES: Category[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'academico', label: 'Academicos' },
  { key: 'deportivo', label: 'Deportes' },
  { key: 'cultural', label: 'Cultura' },
];

const QUICK_ACTIONS = [
  { icon: '🗺️', label: 'Mapa', route: '/map', color: T.success },
  { icon: '🚌', label: 'Polibus', route: '/polibus', color: T.highlight },
  { icon: '📅', label: 'Eventos', route: '/events', color: T.info },
  { icon: '👤', label: 'Perfil', route: '/profile', color: T.accent },
];

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { showGpsPrompt } = useLocalSearchParams<{ showGpsPrompt?: string }>();
  const ue = user ? new UserEntity(user) : null;
  const { data: events } = useInfiniteEvents();
  const { data: routes } = useBusRoutes();
  const { location } = useLocation();

  const scrollY = useSharedValue(0);
  const [activeCategory, setActiveCategory] = React.useState('todos');

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (activeCategory === 'todos') return events;
    return events.filter((e) => (e as any).category === activeCategory);
  }, [events, activeCategory]);

  const activeRoutes = useMemo(
    () => (routes ?? []).filter((r) => r.isActive).length,
    [routes]
  );

  return (
    <View style={styles.root}>
      <GlassHeader
        scrollY={scrollY}
        userName={ue?.displayName}
        userInitials={ue?.initials}
        userAvatar={(user as any)?.avatarUrl ?? null}
        onAvatarPress={() => router.push('/profile' as any)}
      />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        {/* Greeting */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.greeting}>
          <Text style={styles.greetingText}>
            {ue ? `Hola, ${ue.displayName}` : 'Bienvenido a'}
          </Text>
          <Text style={styles.appName}>ESFOTgo</Text>
          <Text style={styles.tagline}>Tu guia inteligente para navegar el campus</Text>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(80)} style={styles.quickActions}>
          {QUICK_ACTIONS.map((item) => (
            <Link key={item.route} href={item.route as any} asChild>
              <View style={styles.quickCard}>
                <View style={[styles.quickIcon, { backgroundColor: item.color + '12' }]}>
                  <Text style={styles.quickEmoji}>{item.icon}</Text>
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </View>
            </Link>
          ))}
        </Animated.View>

        {/* Category Filters */}
        <Animated.View entering={FadeInDown.delay(120)} style={styles.categoriesWrap}>
          <CategoryChip
            categories={CATEGORIES}
            activeKey={activeCategory}
            onSelect={setActiveCategory}
          />
        </Animated.View>

        {/* Hero Banner */}
        {filteredEvents.length > 0 && (
          <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.heroWrap}>
            <HeroBanner
              title={filteredEvents[0].title}
              subtitle={filteredEvents[0].description ?? undefined}
              date={filteredEvents[0].startDate}
              imageUrl={filteredEvents[0].imageUrl}
              actionLabel="Ver evento"
              actionHref="/events"
              category={(filteredEvents[0] as any).category}
            />
          </Animated.View>
        )}

        {/* Transport & Location */}
        {routes && routes.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <SectionHeader title="Transporte" />
            <TransportCard routes={routes} activeRoutes={activeRoutes} />
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(240)} style={styles.section}>
          <SectionHeader title="Campus" />
          <LocationCard
            location={
              location
                ? {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }
                : null
            }
          />
        </Animated.View>

        {/* Upcoming Events */}
        {filteredEvents.length > 1 && (
          <Animated.View entering={FadeInDown.delay(280)} style={styles.section}>
            <SectionHeader
              title="Proximos eventos"
              subtitle="Descubre lo que esta pasando en el campus"
              action={{
                label: 'Ver todos',
                onPress: () => router.push('/events' as any),
              }}
            />
            {filteredEvents.slice(1, 5).map((evt, i) => (
              <Animated.View
                key={evt.id}
                entering={FadeInDown.delay(300 + i * 80).duration(400)}
                style={{ marginTop: i > 0 ? 0 : Sizes.gapSm }}
              >
                <EventCard
                  event={evt}
                  onPress={() => router.push('/events' as any)}
                />
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {/* Auth prompt */}
        {!user && (
          <Animated.View entering={FadeInDown.delay(400)} style={styles.authPrompt}>
            <Text style={styles.authText}>
              Inicia sesion para acceder a todas las funcionalidades
            </Text>
            <Link href="/auth/login" asChild>
              <View style={styles.authBtn}>
                <Text style={styles.authBtnText}>Iniciar sesion</Text>
              </View>
            </Link>
          </Animated.View>
        )}

        {showGpsPrompt === '1' && user && <GpsPermissionPrompt />}

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* FAB */}
      <View style={styles.fabWrap}>
        <Link href="/map" asChild>
          <View style={styles.fab}>
            <Text style={styles.fabIcon}>📍</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8 },
  greeting: {
    paddingHorizontal: Sizes.paddingMd,
    paddingTop: 64,
    gap: 2,
    marginBottom: Sizes.gapLg,
  },
  greetingText: { ...Typography.h3, color: T.textSecondary, fontWeight: '400' },
  appName: { ...Typography.h1, color: T.textPrimary },
  tagline: { ...Typography.body, color: T.textSecondary, marginTop: 4 },

  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.paddingMd,
    gap: 10,
    marginBottom: Sizes.gapMd,
  },
  quickCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickEmoji: { fontSize: 20 },
  quickLabel: { ...Typography.caption, color: T.textSecondary, fontWeight: '600' },

  categoriesWrap: { marginBottom: Sizes.gapMd },

  heroWrap: { marginBottom: Sizes.gapMd },

  section: {
    paddingHorizontal: Sizes.paddingMd,
    marginBottom: Sizes.gapMd,
    gap: Sizes.gapSm,
  },

  authPrompt: {
    margin: Sizes.paddingMd,
    marginTop: Sizes.gapXl,
    padding: Sizes.paddingLg,
    backgroundColor: T.surfaceGlass,
    borderRadius: Sizes.radiusLg,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  authText: { ...Typography.bodySm, color: T.textSecondary, textAlign: 'center' },
  authBtn: {
    backgroundColor: T.primary,
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  authBtnText: { ...Typography.button, color: '#FFFFFF', fontSize: 14 },

  fabWrap: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 40,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: T.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  fabIcon: { fontSize: 24 },
});
