import { supabase } from '@/core/config/supabase';
import { mapSupabaseError, NotFoundError } from '@/core/errors/app-error';
import type { CampusLocation } from '../domain/location.entity';
import type { ILocationRepository } from '../domain/location.repository';

export class SupabaseLocationRepository implements ILocationRepository {
  async getCampusLocations(category?: string): Promise<CampusLocation[]> {
    let query = supabase.from('campus_locations').select('*').order('name');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw mapSupabaseError(error);

    return (data ?? []).map(this.mapToEntity);
  }

  async getLocationById(id: string): Promise<CampusLocation> {
    const { data, error } = await supabase
      .from('campus_locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw mapSupabaseError(error);
    if (!data) throw new NotFoundError('Ubicación no encontrada');

    return this.mapToEntity(data);
  }

  private mapToEntity(row: Record<string, unknown>): CampusLocation {
    return {
      id: row.id as string,
      name: row.name as string,
      description: (row.description as string) ?? null,
      category: row.category as string,
      latitude: row.latitude as number,
      longitude: row.longitude as number,
      imageUrl: (row.image_url as string) ?? null,
      createdAt: row.created_at as string,
    };
  }
}
