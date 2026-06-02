import { useQuery } from '@tanstack/react-query';
import { SupabaseLocationRepository } from '../infrastructure/supabase-location.repository';
import type { CampusLocation } from '../domain/location.entity';

const repository = new SupabaseLocationRepository();

export function useCampusLocations(category?: string) {
  return useQuery<CampusLocation[]>({
    queryKey: ['campus-locations', { category }],
    queryFn: () => repository.getCampusLocations(category),
  });
}

export function useLocationDetail(id: string) {
  return useQuery<CampusLocation>({
    queryKey: ['campus-locations', id],
    queryFn: () => repository.getLocationById(id),
    enabled: !!id,
  });
}
