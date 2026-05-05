import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';



export default function HomeScreen() {
  const menuItems = [
    {
      title: 'Eventos',
      icon: 'calendar-outline',
      route: '/events',
    },
    {
      title: 'Mapa en tiempo real',
      icon: 'location-outline',
      route: '/map',
    },
    {
      title: 'Polibús',
      icon: 'bus-outline',
      route: '/polibus',
    },
    {
      title: 'Mi perfil',
      icon: 'person-outline',
      route: '/profile',
    },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#C62828', dark: '#8E0000' }}
      headerImage={
        <Image
          source={require('@/assets/images/esfotimage.jpg')}
          style={styles.headerImage}
          contentFit="cover"
        />
      }
    >
      {/* Bienvenida */}
      <ThemedView style={styles.headerContent}>
        <ThemedText type="title">Bienvenido Politecnico 👋</ThemedText>
        <ThemedText style={styles.subtitle}>
          Accede a las funcionalidades principales
        </ThemedText>
      </ThemedView>

      {/* Menú */}
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <Link key={index} href={item.route} asChild>
            <Pressable style={styles.card}>
              <Ionicons name={item.icon as any} size={32} color="#C62828" />
              <ThemedText style={styles.cardText}>
                {item.title}
              </ThemedText>
            </Pressable>
          </Link>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  
  headerImage: {
    height: 220,
    width: '100%',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  
  headerContent: {
    marginBottom: 20,
    gap: 6,
  },

  subtitle: {
    opacity: 0.7,
    fontSize: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',

    // sombra
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  cardText: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
    color: '#00205B', // Azul EPN
  },
  
});