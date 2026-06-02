import type { BaseEntity } from '@/core/types';

export interface Event extends BaseEntity {
  title: string;
  description: string | null;
  imageUrl: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  createdBy: string | null;
  organizer: string | null;
}

export type EventCategory =
  | 'academico'
  | 'cultural'
  | 'deportivo'
  | 'tecnologico'
  | 'institucional'
  | 'todos';

export type EventDateFilter = 'todos' | 'proximos' | 'este_mes' | 'pasados';
