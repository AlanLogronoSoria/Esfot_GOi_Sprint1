import type { CampusLocation } from '@/features/map/domain/location.entity';

export interface PoiInput {
  name: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}

export interface PoiUpdateInput {
  name?: string;
  description?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
}

export interface RestrictedZone {
  id: string;
  name: string;
  description?: string;
  coordinates: { latitude: number; longitude: number }[];
  fillColor: string;
  strokeColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PoiEvent {
  type: 'created' | 'updated' | 'deleted';
  poi: CampusLocation;
  timestamp: string;
  userId: string;
}

export type PoiEventListener = (event: PoiEvent) => void;
