import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { useInfiniteEvents } from '@/features/events/application/event.hooks';
import { useBusRoutes } from '@/features/polibus/application/bus.hooks';
import { useCampusLocations } from '@/features/map/application/location.hooks';
import { UserEntity } from '@/features/auth/domain/user.entity';

export default function ExploreScreen() {
  const user = useAuthStore((s) => s.user);
  const userEntity = user ? new UserEntity(user) : null;
  const { totalCount } = useInfiniteEvents();
  const { data: routes } = useBusRoutes();
  const { data: locations } = useCampusLocations();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Explorar</Text>

      {userEntity && (
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hola, {userEntity.displayName}</Text>
          <Text style={styles.greetingRole}>{userEntity.role}</Text>
        </View>
      )}

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Eventos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{routes?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Rutas de bus</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{locations?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Ubicaciones</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        <View style={styles.linksGrid}>
          {QUICK_LINKS.map((link) => (
            <View key={link.label} style={styles.linkCard}>
              <Text style={styles.linkIcon}>{link.icon}</Text>
              <Text style={styles.linkLabel}>{link.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const QUICK_LINKS = [
  { icon: '📅', label: 'Eventos' },
  { icon: '🗺️', label: 'Mapa' },
  { icon: '🚌', label: 'Polibús' },
  { icon: '👤', label: 'Perfil' },
  { icon: '📚', label: 'Biblioteca' },
  { icon: '🍽️', label: 'Comedor' },
];

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  greeting: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  greetingRole: {
    fontSize: 13,
    color: '#6B7280',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B6BB0',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  linkCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  linkIcon: {
    fontSize: 28,
  },
  linkLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
