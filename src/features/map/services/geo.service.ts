import type {
  GeoCoordinate,
  GeoBoundingBox,
  MapMarkerData,
  ClusterPoint,
} from '../domain/coordinates';
import {
  haversineDistance,
  isPointInBoundingBox,
  midpoint,
} from '../domain/coordinates';

const CLUSTER_RADIUS_METERS = 80;
const MIN_MARKERS_FOR_CLUSTER = 8;
const MAX_MARKERS_BEFORE_CLUSTER = 50;

export function filterMarkersInViewport(
  markers: MapMarkerData[],
  viewport: GeoBoundingBox
): MapMarkerData[] {
  return markers.filter((m) => isPointInBoundingBox(m.coordinate, viewport));
}

export function clusterMarkers(
  markers: MapMarkerData[],
  viewport?: GeoBoundingBox
): (MapMarkerData | ClusterPoint)[] {
  if (markers.length < MIN_MARKERS_FOR_CLUSTER) return markers;

  const visible = viewport ? filterMarkersInViewport(markers, viewport) : markers;

  if (visible.length < MIN_MARKERS_FOR_CLUSTER) return visible;
  if (visible.length > MAX_MARKERS_BEFORE_CLUSTER) return mapToClusters(visible);

  return visible;
}

function mapToClusters(markers: MapMarkerData[]): ClusterPoint[] {
  const clusters: ClusterPoint[] = [];
  const assigned = new Set<string>();

  for (let i = 0; i < markers.length; i++) {
    if (assigned.has(markers[i].id)) continue;

    const clusterMarkers: MapMarkerData[] = [markers[i]];
    assigned.add(markers[i].id);

    for (let j = i + 1; j < markers.length; j++) {
      if (assigned.has(markers[j].id)) continue;

      const dist = haversineDistance(markers[i].coordinate, markers[j].coordinate);
      if (dist <= CLUSTER_RADIUS_METERS) {
        clusterMarkers.push(markers[j]);
        assigned.add(markers[j].id);
      }
    }

    if (clusterMarkers.length === 1) {
      clusters.push({
        id: `cluster-${markers[i].id}`,
        coordinate: markers[i].coordinate,
        count: 1,
        topCategory: markers[i].category,
        markers: clusterMarkers,
      });
    } else {
      const center = computeClusterCenter(clusterMarkers.map((m) => m.coordinate));
      const topCat = getTopCategory(clusterMarkers);

      clusters.push({
        id: `cluster-${i}`,
        coordinate: center,
        count: clusterMarkers.length,
        topCategory: topCat,
        markers: clusterMarkers,
      });
    }
  }

  return clusters;
}

function computeClusterCenter(coords: GeoCoordinate[]): GeoCoordinate {
  if (coords.length === 1) return coords[0];

  let center = coords[0];
  for (let i = 1; i < coords.length; i++) {
    center = midpoint(center, coords[i]);
  }
  return center;
}

function getTopCategory(markers: MapMarkerData[]): string {
  const freq = new Map<string, number>();
  for (const m of markers) {
    freq.set(m.category, (freq.get(m.category) ?? 0) + 1);
  }
  let top = markers[0].category;
  let max = 0;
  for (const [cat, count] of freq) {
    if (count > max) {
      max = count;
      top = cat;
    }
  }
  return top;
}

export function calculateRouteDistance(points: GeoCoordinate[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineDistance(points[i - 1], points[i]);
  }
  return total;
}

export function calculateETA(
  points: GeoCoordinate[],
  currentIndex: number,
  avgSpeedKmh: number = 30
): number {
  const remainingPoints = points.slice(currentIndex);
  const remainingDistance = calculateRouteDistance(remainingPoints);
  const speedMs = (avgSpeedKmh * 1000) / 3600;
  return speedMs > 0 ? (remainingDistance / speedMs) * 60 : 0;
}

export function douglasPeuckerSimplify(
  points: GeoCoordinate[],
  toleranceMeters: number
): GeoCoordinate[] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let maxIdx = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (dist > maxDist) {
      maxDist = dist;
      maxIdx = i;
    }
  }

  if (maxDist > toleranceMeters) {
    const left = douglasPeuckerSimplify(points.slice(0, maxIdx + 1), toleranceMeters);
    const right = douglasPeuckerSimplify(points.slice(maxIdx), toleranceMeters);
    return [...left.slice(0, -1), ...right];
  }

  return [points[0], points[points.length - 1]];
}

function perpendicularDistance(
  point: GeoCoordinate,
  lineStart: GeoCoordinate,
  lineEnd: GeoCoordinate
): number {
  const lineDist = haversineDistance(lineStart, lineEnd);
  if (lineDist < 0.01) return haversineDistance(point, lineStart);

  const d1 = haversineDistance(point, lineStart);
  const d2 = haversineDistance(point, lineEnd);

  const s = (lineDist + d1 + d2) / 2;
  const area = Math.sqrt(
    Math.max(0, s * (s - lineDist) * (s - d1) * (s - d2))
  );

  return (2 * area) / lineDist;
}

export function interpolatePosition(
  from: GeoCoordinate,
  to: GeoCoordinate,
  fraction: number
): GeoCoordinate {
  return {
    latitude: from.latitude + (to.latitude - from.latitude) * fraction,
    longitude: from.longitude + (to.longitude - from.longitude) * fraction,
  };
}
