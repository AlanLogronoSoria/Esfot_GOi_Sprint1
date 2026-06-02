import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/auth.store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'administrador';
  const isDocente = user?.role === 'docente';

  const color = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: color,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
        <Tabs.Screen
          name="index"
          options={{ title: 'Home', tabBarIcon: ({ color: c }) => <IconSymbol size={28} name="house.fill" color={c} /> }}
        />
        <Tabs.Screen
          name="events"
          options={{ title: 'Eventos', tabBarIcon: ({ color: c }) => <IconSymbol size={28} name="calendar" color={c} /> }}
        />
        <Tabs.Screen
          name="map"
          options={{ title: 'Mapa', tabBarIcon: ({ color: c }) => <IconSymbol size={28} name="map.fill" color={c} /> }}
        />
        <Tabs.Screen
          name="polibus"
          options={{ title: 'Polibús', tabBarIcon: ({ color: c }) => <IconSymbol size={28} name="bus" color={c} /> }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: 'Perfil', tabBarIcon: ({ color: c }) => <IconSymbol size={28} name="person.fill" color={c} /> }}
        />

        {isAdmin && (
          <>
            <Tabs.Screen
              name="admin"
              options={{ title: 'Admin', tabBarIcon: ({ color: c }) => <IconSymbol size={28} name="shield.fill" color={c} /> }}
            />
            <Tabs.Screen
              name="admin-map"
              options={{ title: 'Cartografía', tabBarIcon: ({ color: c }) => <IconSymbol size={28} name="map.fill" color={c} /> }}
            />
          </>
        )}

        {isDocente && (
          <Tabs.Screen
            name="tutorias"
            options={{ title: 'Tutorías', tabBarIcon: ({ color: c }) => <IconSymbol size={28} name="calendar" color={c} /> }}
          />
        )}
      </Tabs>
  );
}
