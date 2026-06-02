import type { CampusLocation } from './location.entity';

export interface ILocationRepository {
  getCampusLocations(category?: string): Promise<CampusLocation[]>;
  getLocationById(id: string): Promise<CampusLocation>;
}
