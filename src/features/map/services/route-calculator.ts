import type { GeoCoordinate } from '@/features/map/domain/coordinates';
import { haversineDistance, bearing, destinationPoint } from '@/features/map/domain/coordinates';

export interface RouteCalculation {
  origin: GeoCoordinate;
  destination: GeoCoordinate;
  distance: number;
  bearing: number;
  waypoints: GeoCoordinate[];
  etaMinutes: number;
}

const AVG_WALKING_SPEED_KMH = 5;
const WAYPOINT_INTERVAL_M = 15;

export function calculateOptimalRoute(
  origin: GeoCoordinate,
  destination: GeoCoordinate
): RouteCalculation {
  const dist = haversineDistance(origin, destination);
  const brg = bearing(origin, destination);
  const waypoints = generateWaypoints(origin, destination, dist, brg);
  const etaMinutes = (dist / 1000 / AVG_WALKING_SPEED_KMH) * 60;

  return {
    origin,
    destination,
    distance: Math.round(dist),
    bearing: Math.round(brg),
    waypoints,
    etaMinutes: Math.round(etaMinutes),
  };
}

function generateWaypoints(
  origin: GeoCoordinate,
  destination: GeoCoordinate,
  totalDistance: number,
  direction: number
): GeoCoordinate[] {
  const points: GeoCoordinate[] = [origin];
  const steps = Math.max(2, Math.floor(totalDistance / WAYPOINT_INTERVAL_M));

  for (let i = 1; i < steps; i++) {
    const dist = (totalDistance / steps) * i;
    const point = destinationPoint(origin, dist, direction);
    points.push(point);
  }

  points.push(destination);
  return points;
}

export function formatRouteInfo(route: RouteCalculation): {
  distanceLabel: string;
  etaLabel: string;
  directionLabel: string;
} {
  const meters = route.distance;
  const distanceLabel =
    meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1)} km`;

  const mins = route.etaMinutes;
  const etaLabel = mins < 1 ? '< 1 min' : mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h ${mins % 60} min`;

  const dir = route.bearing;
  let directionLabel: string;
  if (dir < 22.5 || dir >= 337.5) directionLabel = '↑ Norte';
  else if (dir < 67.5) directionLabel = '↗ Noreste';
  else if (dir < 112.5) directionLabel = '→ Este';
  else if (dir < 157.5) directionLabel = '↘ Sureste';
  else if (dir < 202.5) directionLabel = '↓ Sur';
  else if (dir < 247.5) directionLabel = '↙ Suroeste';
  else if (dir < 292.5) directionLabel = '← Oeste';
  else directionLabel = '↖ Noroeste';

  return { distanceLabel, etaLabel, directionLabel };
}
