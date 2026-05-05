import EventCardView from '@/components/EventCard';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, TextInput as RNInput, StyleSheet, View } from 'react-native';

type Event = { id: string; title: string; date: string; time?: string; location?: string; image?: string };

const fakeEvents: Event[] = new Array(12).fill(0).map((_, i) => ({
  id: String(i + 1),
  title: `Evento ${i + 1}`,
  date: `2026-05-${String(i + 1).padStart(2, '0')}`,
  time: '10:00',
  location: 'Campus EPN',
  image: 'https://picsum.photos/200/200?random=' + i,
}));

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // simulate async load
    setTimeout(() => setEvents(fakeEvents), 700);
  }, []);

  const filtered = events.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: 'Eventos' }} />
      <RNInput placeholder="Buscar eventos" style={s.search} value={query} onChangeText={setQuery} />
      <FlatList data={filtered} keyExtractor={(i) => i.id} contentContainerStyle={{ padding: 16 }} renderItem={({ item }) => (
        <EventCardView title={item.title} date={item.date} time={item.time} location={item.location} image={item.image} />
      )} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  search: { margin: 12, padding: 10, backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 16 },
});
