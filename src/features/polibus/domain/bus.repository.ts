import type { BusRoute, BusStop, BusLocation } from './route.entity';

export interface IBusRepository {
  getRoutes(): Promise<BusRoute[]>;
  getRouteStops(routeId: string): Promise<BusStop[]>;
  getBusLocations(routeId: string): Promise<BusLocation[]>;
}
