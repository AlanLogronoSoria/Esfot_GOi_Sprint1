import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import type { Event } from '../domain/event.entity';
import { LightTheme as T, Shadows, Sizes, EPN_GOLD, Typography } from '@/constants/design-system';
import { memo } from 'react';

const { width: W } = Dimensions.get('window');

interface EventCardProps { event: Event; onPress?: (event: Event) => void; }

export const EventCard = memo(function EventCard({ event, onPress }: EventCardProps) {
  const d = new Date(event.startDate);
  const past = d < new Date();
  return (
    <TouchableOpacity style={[s.card, past && s.past]} onPress={() => onPress?.(event)} activeOpacity={0.9}>
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={s.img} resizeMode="cover" />
      ) : (
        <View style={s.imgFallback}><Text style={s.imgFallbackEmoji}>📅</Text></View>
      )}
      <View style={[s.dateTag, { backgroundColor: T.surface }]}>
        <Text style={s.dateDay}>{d.getDate()}</Text>
        <Text style={s.dateMonth}>{d.toLocaleDateString('es', { month: 'short' }).toUpperCase()}</Text>
      </View>
      {past && (
        <View style={s.pastTag}><Text style={s.pastTagText}>Finalizado</Text></View>
      )}
      <View style={s.body}>
        <Text style={s.title} numberOfLines={2}>{event.title}</Text>
        {event.description && <Text style={s.desc} numberOfLines={2}>{event.description}</Text>}
        <View style={s.meta}>
          <Text style={s.metaItem}>📅 {d.getDate()} {d.toLocaleDateString('es', { month: 'short' })} · {d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</Text>
          {event.location && <Text style={s.metaItem}>📍 {event.location}</Text>}
          {event.organizer && <Text style={s.metaItem}>👤 {event.organizer}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const s = StyleSheet.create({
  card: { backgroundColor: T.surfaceGlass, borderRadius: Sizes.radiusLg, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: T.cardBorder, ...Shadows.md },
  past: { opacity: 0.55 },
  img: { width: '100%', height: 180 },
  imgFallback: { width: '100%', height: 100, backgroundColor: T.surface, justifyContent: 'center', alignItems: 'center' },
  imgFallbackEmoji: { fontSize: 40 },
  dateTag: { position: 'absolute', top: 10, left: 10, borderRadius: Sizes.radiusSm, paddingVertical: 5, paddingHorizontal: 9, alignItems: 'center', ...Shadows.sm },
  dateDay: { fontSize: 20, fontWeight: '800', color: EPN_GOLD },
  dateMonth: { fontSize: 10, fontWeight: '700', color: T.textTertiary, letterSpacing: 1 },
  pastTag: { position: 'absolute', top: 10, right: 10, backgroundColor: T.textMuted, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 7 },
  pastTagText: { fontSize: 10, fontWeight: '700', color: T.text },
  body: { padding: Sizes.paddingMd, gap: 8 },
  title: { ...Typography.h4, color: T.textPrimary },
  desc: { ...Typography.bodySm, color: T.textSecondary, lineHeight: 20 },
  meta: { gap: 4, marginTop: 2 },
  metaItem: { ...Typography.caption, color: T.textSecondary },
});
