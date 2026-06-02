import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { UserEntity } from '@/features/auth/domain/user.entity';
import { useInfiniteEvents } from '@/features/events/application/event.hooks';
import { useBusRoutes, useRouteStops } from '@/features/polibus/application/bus.hooks';
import { GpsPermissionPrompt } from '@/features/auth/presentation/gps-permission-prompt';
import { DarkTheme as T, Shadows, Sizes, Typography, EPN_GOLD } from '@/constants/design-system';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W * 0.72;

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { showGpsPrompt } = useLocalSearchParams<{ showGpsPrompt?: string }>();
  const ue = user ? new UserEntity(user) : null;
  const { data: events } = useInfiniteEvents();
  const { data: routes } = useBusRoutes();

  const menu = [
    { icon: '📅', label: 'Eventos', route: '/(tabs)/events', color: '#64D2FF' },
    { icon: '🗺️', label: 'Mapa', route: '/(tabs)/map', color: '#30D158' },
    { icon: '🚌', label: 'Polibús', route: '/(tabs)/polibus', color: '#FFB81C' },
    { icon: '👤', label: 'Perfil', route: '/(tabs)/profile', color: '#FF6482' },
  ];

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
      {/* Header */}
      <View>
        <View style={s.headerTop}>
          <View>
            <Text style={s.greeting}>{ue ? `Hola, ${ue.displayName}` : 'Bienvenido'}</Text>
            <Text style={s.subtitle}>Escuela Politécnica Nacional</Text>
          </View>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{ue?.initials ?? 'U'}</Text>
          </View>
        </View>

        {/* Transport Widget */}
        {routes && routes.length > 0 && (
          <View style={s.transportWidget}>
            <Text style={s.widgetLabel}>🚌 POLIBÚS</Text>
            <Text style={s.widgetValue}>{routes.length} rutas activas</Text>
            <View style={s.widgetDots}>
              {routes.slice(0, 3).map((r, i) => (
                <View key={r.id} style={[s.dot, { backgroundColor: r.color }]} />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Quick Access */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Accesos rápidos</Text>
        <View style={s.grid}>
          {menu.map((item) => (
            <Link key={item.route} href={item.route as any} asChild>
              <Pressable style={s.gridItem}>
                <View style={[s.gridIcon, { backgroundColor: item.color + '18' }]}>
                  <Text style={s.gridEmoji}>{item.icon}</Text>
                </View>
                <Text style={s.gridLabel}>{item.label}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>

      {/* Upcoming Events */}
      {events && events.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Próximos eventos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }}>
            {events.slice(0, 5).map((evt) => (
              <Link key={evt.id} href="/(tabs)/events" asChild>
                <Pressable style={s.eventCard}>
                  <View style={s.eventDate}>
                    <Text style={s.eventDay}>{new Date(evt.startDate).getDate()}</Text>
                    <Text style={s.eventMonth}>{new Date(evt.startDate).toLocaleDateString('es', { month: 'short' }).toUpperCase()}</Text>
                  </View>
                  <Text style={s.eventTitle} numberOfLines={2}>{evt.title}</Text>
                  <Text style={s.eventMeta}>📍 {evt.location ?? 'EPN'}</Text>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Auth prompt for guests */}
      {!user && (
        <View style={s.authPrompt}>
          <Text style={s.authText}>Inicia sesión para acceder a todas las funcionalidades</Text>
          <Link href="/auth/login" asChild>
            <Pressable style={s.authBtn}>
              <Text style={s.authBtnText}>Iniciar sesión</Text>
            </Pressable>
          </Link>
        </View>
      )}

      {showGpsPrompt === '1' && user && <GpsPermissionPrompt />}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.background },
  content: { paddingBottom: 40 },
  header: { padding: Sizes.paddingXl, paddingTop: 56, gap: Sizes.gapMd, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { ...Typography.h2, color: T.text },
  subtitle: { ...Typography.bodySm, color: 'rgba(255,255,255,0.6)' },
  avatar: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: { color: T.text, fontSize: 18, fontWeight: '800' },
  transportWidget: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    borderRadius: Sizes.radiusMd, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden',
  },
  widgetLabel: { ...Typography.label, color: EPN_GOLD },
  widgetValue: { ...Typography.bodySm, color: T.textSecondary, flex: 1 },
  widgetDots: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  section: { paddingHorizontal: Sizes.paddingMd, marginTop: Sizes.gapLg, gap: Sizes.gapSm },
  sectionTitle: { ...Typography.h4, color: T.textPrimary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: {
    width: (SCREEN_W - 52) / 2, backgroundColor: T.surfaceGlass,
    borderRadius: Sizes.radiusLg, padding: 18, alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: T.cardBorder, ...Shadows.sm,
  },
  gridIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  gridEmoji: { fontSize: 22 },
  gridLabel: { ...Typography.bodySm, color: T.textSecondary, fontWeight: '600' },
  eventCard: {
    width: CARD_W, backgroundColor: T.surfaceGlass, borderRadius: Sizes.radiusLg,
    padding: 16, gap: 6, borderWidth: 1, borderColor: T.cardBorder,
  },
  eventDate: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  eventDay: { fontSize: 28, fontWeight: '800', color: EPN_GOLD },
  eventMonth: { fontSize: 12, fontWeight: '700', color: T.textTertiary },
  eventTitle: { ...Typography.body, color: T.textPrimary, fontWeight: '600', marginTop: 4 },
  eventMeta: { ...Typography.caption, color: T.textSecondary },
  authPrompt: {
    margin: Sizes.paddingMd, marginTop: Sizes.gapXl, padding: Sizes.paddingLg,
    backgroundColor: T.surfaceGlass, borderRadius: Sizes.radiusLg, alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: T.cardBorder,
  },
  authText: { ...Typography.bodySm, color: T.textSecondary, textAlign: 'center' },
  authBtn: {
    backgroundColor: T.primary, borderRadius: Sizes.radiusMd,
    paddingHorizontal: 28, paddingVertical: 12,
  },
  authBtnText: { ...Typography.button, color: T.text, fontSize: 14 },
});
