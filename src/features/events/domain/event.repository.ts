import type { Event } from './event.entity';
import type { PaginatedResponse } from '@/core/types';

export interface IEventRepository {
  getEvents(page?: number, pageSize?: number, search?: string): Promise<PaginatedResponse<Event>>;
  getEventById(id: string): Promise<Event>;
  createEvent(input: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event>;
  updateEvent(id: string, input: Partial<Event>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
}
