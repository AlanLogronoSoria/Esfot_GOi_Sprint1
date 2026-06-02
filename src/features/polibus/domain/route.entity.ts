export interface BusRoute {
  id: string;
  name: string;
  description: string | null;
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface BusStop {
  id: string;
  routeId: string;
  name: string;
  latitude: number;
  longitude: number;
  stopOrder: number;
  createdAt: string;
}

export interface BusLocation {
  id: string;
  routeId: string;
  busId: string;
  latitude: number;
  longitude: number;
  heading: number;
  updatedAt: string;
}

export interface BusRouteWithStops extends BusRoute {
  stops: BusStop[];
  busLocations: BusLocation[];
}
