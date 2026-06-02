import { supabase } from '@/core/config/supabase';
import { mapSupabaseError, NotFoundError } from '@/core/errors/app-error';
import type { CampusLocation } from '@/features/map/domain/location.entity';
import type { PoiInput, PoiUpdateInput, RestrictedZone } from '../domain/poi.entity';
import { poiEventBus } from '../application/poi-events';
import { isDevMode } from '@/core/config/env';
import { MockData } from '@/core/dev/mock-services';

export class SupabasePoiRepository {
  async getAll(): Promise<CampusLocation[]> {
    if (isDevMode()) return MockData.getCampusLocations();

    const { data, error } = await supabase
      .from('campus_locations')
      .select('*')
      .order('name');

    if (error) throw mapSupabaseError(error);
    return (data ?? []).map(this.mapToEntity);
  }

  async getById(id: string): Promise<CampusLocation> {
    const { data, error } = await supabase
      .from('campus_locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw mapSupabaseError(error);
    if (!data) throw new NotFoundError('POI no encontrado');
    return this.mapToEntity(data);
  }

  async create(input: PoiInput, userId: string): Promise<CampusLocation> {
    if (isDevMode()) {
      const entity = this.mapInputToEntity(input, crypto.randomUUID());
      return entity;
    }

    const { data, error } = await supabase
      .from('campus_locations')
      .insert({
        name: input.name,
        description: input.description ?? null,
        category: input.category,
        latitude: input.latitude,
        longitude: input.longitude,
        image_url: input.imageUrl ?? null,
      })
      .select()
      .single();

    if (error) throw mapSupabaseError(error);
    const entity = this.mapToEntity(data);
    poiEventBus.emit('created', entity, userId);
    return entity;
  }

  async update(id: string, input: PoiUpdateInput, userId: string): Promise<CampusLocation> {
    if (isDevMode()) {
      return { id, name: input.name ?? '', description: input.description ?? null, category: input.category ?? 'otro', latitude: input.latitude ?? 0, longitude: input.longitude ?? 0, imageUrl: input.imageUrl ?? null, createdAt: '' };
    }

    const updates: Record<string, unknown> = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.description !== undefined) updates.description = input.description;
    if (input.category !== undefined) updates.category = input.category;
    if (input.latitude !== undefined) updates.latitude = input.latitude;
    if (input.longitude !== undefined) updates.longitude = input.longitude;
    if (input.imageUrl !== undefined) updates.image_url = input.imageUrl;

    const { data, error } = await supabase
      .from('campus_locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw mapSupabaseError(error);
    const entity = this.mapToEntity(data);
    poiEventBus.emit('updated', entity, userId);
    return entity;
  }

  async delete(id: string, userId: string): Promise<void> {
    if (isDevMode()) return;

    const { error } = await supabase.from('campus_locations').delete().eq('id', id);
    if (error) throw mapSupabaseError(error);
    poiEventBus.emit('deleted', { id, name: '', description: null, category: '', latitude: 0, longitude: 0, imageUrl: null, createdAt: '' }, userId);
  }

  async getZones(): Promise<RestrictedZone[]> {
    if (isDevMode()) return [];
    const { data, error } = await supabase.from('restricted_zones').select('*');
    if (error) throw mapSupabaseError(error);
    return (data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      name: r.name as string,
      description: (r.description as string) ?? undefined,
      coordinates: (r.coordinates as { latitude: number; longitude: number }[]) ?? [],
      fillColor: (r.fill_color as string) ?? 'rgba(200,16,46,0.2)',
      strokeColor: (r.stroke_color as string) ?? '#C8102E',
      isActive: (r.is_active as boolean) ?? true,
      createdAt: r.created_at as string,
      updatedAt: r.updated_at as string,
    }));
  }

  async createZone(zone: Omit<RestrictedZone, 'id' | 'createdAt' | 'updatedAt'>): Promise<RestrictedZone> {
    const { data, error } = await supabase
      .from('restricted_zones')
      .insert({
        name: zone.name,
        description: zone.description,
        coordinates: zone.coordinates,
        fill_color: zone.fillColor,
        stroke_color: zone.strokeColor,
        is_active: zone.isActive,
      })
      .select()
      .single();

    if (error) throw mapSupabaseError(error);
    return {
      id: data.id as string,
      name: data.name as string,
      description: data.description as string,
      coordinates: data.coordinates as RestrictedZone['coordinates'],
      fillColor: data.fill_color as string,
      strokeColor: data.stroke_color as string,
      isActive: data.is_active as boolean,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }

  async deleteZone(id: string): Promise<void> {
    const { error } = await supabase.from('restricted_zones').delete().eq('id', id);
    if (error) throw mapSupabaseError(error);
  }

  subscribeToChanges(callback: () => void): () => void {
    const channel = supabase
      .channel('admin-poi-changes')
      .on(
        'postgres_changes' as never,
        { event: '*', schema: 'public', table: 'campus_locations' },
        callback as never
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  private mapToEntity(row: Record<string, unknown>): CampusLocation {
    return {
      id: row.id as string,
      name: row.name as string,
      description: (row.description as string) ?? null,
      category: (row.category as string) ?? 'otro',
      latitude: row.latitude as number,
      longitude: row.longitude as number,
      imageUrl: (row.image_url as string) ?? null,
      createdAt: (row.created_at as string) ?? new Date().toISOString(),
    };
  }

  private mapInputToEntity(input: PoiInput, id: string): CampusLocation {
    return {
      id,
      name: input.name,
      description: input.description ?? null,
      category: input.category,
      latitude: input.latitude,
      longitude: input.longitude,
      imageUrl: input.imageUrl ?? null,
      createdAt: new Date().toISOString(),
    };
  }
}
