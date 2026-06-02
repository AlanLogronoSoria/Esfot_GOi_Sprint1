import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SupabasePoiRepository } from '../infrastructure/supabase-poi.repository';
import { poiEventBus } from './poi-events';
import { useAuthStore } from '@/store/auth.store';
import type { CampusLocation } from '@/features/map/domain/location.entity';
import type { PoiInput, PoiUpdateInput } from '../domain/poi.entity';

const repository = new SupabasePoiRepository();

export function useAdminPois() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id ?? 'dev');

  const query = useQuery<CampusLocation[]>({
    queryKey: ['admin', 'pois'],
    queryFn: () => repository.getAll(),
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    const unsubscribe = repository.subscribeToChanges(() => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pois'] });
    });

    const unsubEventBus = poiEventBus.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pois'] });
    });

    return () => {
      unsubscribe();
      unsubEventBus();
    };
  }, [queryClient]);

  const createPoi = useMutation({
    mutationFn: (input: PoiInput) => repository.create(input, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pois'] }),
  });

  const updatePoi = useMutation({
    mutationFn: ({ id, input }: { id: string; input: PoiUpdateInput }) =>
      repository.update(id, input, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pois'] }),
  });

  const deletePoi = useMutation({
    mutationFn: (id: string) => repository.delete(id, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pois'] }),
  });

  return {
    pois: query.data ?? [],
    isLoading: query.isLoading,
    createPoi,
    updatePoi,
    deletePoi,
  };
}

export function useAdminZones() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'zones'],
    queryFn: () => repository.getZones(),
    staleTime: 1000 * 60 * 5,
  });

  const createZone = useMutation({
    mutationFn: repository.createZone.bind(repository),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'zones'] }),
  });

  const deleteZone = useMutation({
    mutationFn: (id: string) => repository.deleteZone(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'zones'] }),
  });

  return {
    zones: query.data ?? [],
    isLoading: query.isLoading,
    createZone,
    deleteZone,
  };
}
