import { supabase } from '@/core/config/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type TableRow = Record<string, unknown>;

export function subscribeToTable<T extends TableRow>(
  table: string,
  options: {
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    filter?: string;
    schema?: string;
  },
  callback: (payload: RealtimePostgresChangesPayload<T>) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes' as never,
      {
        event: options.event ?? '*',
        schema: options.schema ?? 'public',
        table,
        filter: options.filter,
      },
      callback as never
    )
    .subscribe();

  return channel;
}

export function subscribeToBusLocations(
  routeId: string,
  callback: (payload: RealtimePostgresChangesPayload<TableRow>) => void
): RealtimeChannel {
  return subscribeToTable('bus_locations', {
    event: '*',
    filter: `route_id=eq.${routeId}`,
  }, callback);
}

export function unsubscribeChannel(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}
