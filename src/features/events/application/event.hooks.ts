import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useState, useRef, useCallback } from 'react';
import { SupabaseEventRepository } from '../infrastructure/supabase-event.repository';
import type { EventDateFilter } from '../domain/event.entity';
import { isDevMode } from '@/core/config/env';
import { MockData } from '@/core/dev/mock-services';

const repository = new SupabaseEventRepository();
const PAGE_SIZE = 10;

export function useInfiniteEvents(search?: string, dateFilter: EventDateFilter = 'todos') {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search ?? '');

  const setSearch = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(query), 300);
  }, []);

  const query = useInfiniteQuery({
    queryKey: ['events', 'infinite', { search: debouncedSearch, dateFilter }],
    queryFn: async ({ pageParam = 0 }) => {
      if (isDevMode()) {
        const mock = await MockData.getEvents();
        let filtered = mock.data;

        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          filtered = filtered.filter(
            (e) =>
              e.title.toLowerCase().includes(q) ||
              (e.description ?? '').toLowerCase().includes(q) ||
              (e.location ?? '').toLowerCase().includes(q)
          );
        }

        if (dateFilter === 'proximos') {
          const now = new Date().toISOString();
          filtered = filtered.filter((e) => e.startDate >= now);
        } else if (dateFilter === 'pasados') {
          const now = new Date().toISOString();
          filtered = filtered.filter((e) => e.startDate < now);
        }

        const start = pageParam * PAGE_SIZE;
        const page = filtered.slice(start, start + PAGE_SIZE);
        return {
          data: page,
          count: filtered.length,
          nextPage: start + PAGE_SIZE < filtered.length ? pageParam + 1 : undefined,
        };
      }

      const result = await repository.getEvents(pageParam + 1, PAGE_SIZE, debouncedSearch || undefined);
      return {
        data: result.data,
        count: result.count,
        nextPage: result.data.length === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 3,
  });

  const allEvents = useMemo(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data]
  );

  const totalCount = query.data?.pages[0]?.count ?? 0;

  return {
    ...query,
    data: allEvents,
    totalCount,
    setSearch,
    debouncedSearch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
