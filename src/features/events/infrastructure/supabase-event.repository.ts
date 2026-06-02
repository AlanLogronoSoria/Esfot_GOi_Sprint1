import { supabase } from '@/core/config/supabase';
import { mapSupabaseError, NotFoundError } from '@/core/errors/app-error';
import type { Event } from '../domain/event.entity';
import type { IEventRepository } from '../domain/event.repository';
import type { PaginatedResponse } from '@/core/types';

export class SupabaseEventRepository implements IEventRepository {
  async getEvents(
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<PaginatedResponse<Event>> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('start_date', { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw mapSupabaseError(error);

    return {
      data: (data ?? []).map(this.mapToEntity),
      count: count ?? 0,
      page,
      pageSize,
    };
  }

  async getEventById(id: string): Promise<Event> {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();

    if (error) throw mapSupabaseError(error);
    if (!data) throw new NotFoundError('Evento no encontrado');

    return this.mapToEntity(data);
  }

  async createEvent(input: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: input.title,
        description: input.description,
        image_url: input.imageUrl,
        location: input.location,
        start_date: input.startDate,
        end_date: input.endDate,
        created_by: input.createdBy,
      })
      .select()
      .single();

    if (error) throw mapSupabaseError(error);

    return this.mapToEntity(data);
  }

  async updateEvent(id: string, input: Partial<Event>): Promise<Event> {
    const updates: Record<string, unknown> = {};

    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.imageUrl !== undefined) updates.image_url = input.imageUrl;
    if (input.location !== undefined) updates.location = input.location;
    if (input.startDate !== undefined) updates.start_date = input.startDate;
    if (input.endDate !== undefined) updates.end_date = input.endDate;

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw mapSupabaseError(error);

    return this.mapToEntity(data);
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) throw mapSupabaseError(error);
  }

  private mapToEntity(row: Record<string, unknown>): Event {
    return {
      id: row.id as string,
      title: row.title as string,
      description: (row.description as string) ?? null,
      imageUrl: (row.image_url as string) ?? null,
      location: (row.location as string) ?? null,
      startDate: row.start_date as string,
      endDate: (row.end_date as string) ?? null,
      createdBy: (row.created_by as string) ?? null,
      organizer: (row.organizer as string) ?? null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }
}
