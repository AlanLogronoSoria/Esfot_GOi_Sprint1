import React, { useState, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { useInfiniteEvents } from '@/features/events/application/event.hooks';
import { EventCard } from '@/features/events/presentation/event-card';
import { EventCardSkeleton } from '@/features/events/presentation/event-skeleton';
import { EventFilters } from '@/features/events/presentation/event-filters';
import type { Event, EventDateFilter } from '@/features/events/domain/event.entity';
import { GlassInput } from '@/shared/components/premium';
import { DarkTheme as T, Sizes, Shadows } from '@/constants/design-system';

const SKELETONS = 3;

export default function EventsScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<EventDateFilter>('todos');

  const { data: events, setSearch: doSearch, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isRefetching, refetch, totalCount } = useInfiniteEvents(search || undefined, filter);

  const renderItem = useCallback(({ item }: { item: Event }) => <EventCard event={item} />, []);
  const keyFn = useCallback((item: Event) => item.id, []);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Eventos</Text>
        <View style={s.countBadge}><Text style={s.countText}>{totalCount}</Text></View>
      </View>

      <View style={s.searchWrap}>
        <GlassInput
          icon="🔍"
          placeholder="Buscar eventos..."
          value={search}
          onChangeText={(t: string) => { setSearch(t); doSearch(t); }}
        />
      </View>

      <EventFilters dateFilter={filter} onDateFilterChange={setFilter} />

      {isLoading ? (
        <View style={s.skels}>{Array.from({ length: SKELETONS }).map((_, i) => <EventCardSkeleton key={i} />)}</View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={keyFn}
          contentContainerStyle={s.list}
          keyboardShouldPersistTaps="handled"
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetchingNextPage ? <Text style={s.footer}>Cargando más...</Text> : null}
          ListEmptyComponent={<View style={s.empty}><Text style={s.emptyText}>No se encontraron eventos</Text></View>}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={T.primary} colors={[T.primary]} />}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews maxToRenderPerBatch={5} windowSize={7} initialNumToRender={5}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, paddingBottom: 0 },
  title: { fontSize: 26, fontWeight: '800', color: T.textPrimary },
  countBadge: { backgroundColor: T.primary, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { fontSize: 13, fontWeight: '700', color: T.text },
  searchWrap: { padding: 16, paddingBottom: 8 },
  skels: { padding: 16 },
  list: { padding: 16, paddingTop: 8 },
  footer: { textAlign: 'center', color: T.textSecondary, padding: 16, fontSize: 13 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 15, color: T.textSecondary },
});
