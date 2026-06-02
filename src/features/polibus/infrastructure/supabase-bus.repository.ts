import { supabase } from '@/core/config/supabase';
import { mapSupabaseError } from '@/core/errors/app-error';
import type { BusRoute, BusStop, BusLocation } from '../domain/route.entity';
import type { IBusRepository } from '../domain/bus.repository';

export class SupabaseBusRepository implements IBusRepository {
  async getRoutes(): Promise<BusRoute[]> {
    const { data, error } = await supabase
      .from('bus_routes')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw mapSupabaseError(error);

    return (data ?? []).map(this.mapRouteToEntity);
  }

  async getRouteStops(routeId: string): Promise<BusStop[]> {
    const { data, error } = await supabase
      .from('bus_stops')
      .select('*')
      .eq('route_id', routeId)
      .order('stop_order');

    if (error) throw mapSupabaseError(error);

    return (data ?? []).map(this.mapStopToEntity);
  }

  async getBusLocations(routeId: string): Promise<BusLocation[]> {
    const { data, error } = await supabase
      .from('bus_locations')
      .select('*')
      .eq('route_id', routeId)
      .order('updated_at', { ascending: false });

    if (error) throw mapSupabaseError(error);

    return (data ?? []).map(this.mapLocationToEntity);
  }

  private mapRouteToEntity(row: Record<string, unknown>): BusRoute {
    return {
      id: row.id as string,
      name: row.name as string,
      description: (row.description as string) ?? null,
      color: (row.color as string) ?? '#1B6BB0',
      isActive: (row.is_active as boolean) ?? true,
      createdAt: row.created_at as string,
    };
  }

  private mapStopToEntity(row: Record<string, unknown>): BusStop {
    return {
      id: row.id as string,
      routeId: row.route_id as string,
      name: row.name as string,
      latitude: row.latitude as number,
      longitude: row.longitude as number,
      stopOrder: row.stop_order as number,
      createdAt: row.created_at as string,
    };
  }

  private mapLocationToEntity(row: Record<string, unknown>): BusLocation {
    return {
      id: row.id as string,
      routeId: row.route_id as string,
      busId: row.bus_id as string,
      latitude: row.latitude as number,
      longitude: row.longitude as number,
      heading: (row.heading as number) ?? 0,
      updatedAt: row.updated_at as string,
    };
  }
}
