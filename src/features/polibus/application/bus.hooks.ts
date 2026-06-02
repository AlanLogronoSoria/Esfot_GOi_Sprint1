import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useMemo, useState } from 'react';
import { SupabaseBusRepository } from '../infrastructure/supabase-bus.repository';
import type { BusRoute, BusStop, BusLocation } from '../domain/route.entity';
import type { GeoCoordinate } from '@/features/map/domain/coordinates';
import { douglasPeuckerSimplify, calculateRouteDistance, calculateETA } from '@/features/map/services/geo.service';
import { subscribeToBusLocations, unsubscribeChannel } from '@/services/supabase/realtime';
import { useBatteryOptimizer } from '@/features/map/services/battery-optimizer';
import { geoCache } from '@/features/map/infrastructure/geo-cache';
import { isDevMode } from '@/core/config/env';
import { MockData } from '@/core/dev/mock-services';

const repository = new SupabaseBusRepository();
const POLYLINE_SIMPLIFY_TOLERANCE_M = 5;
const CACHE_TTL_BUS_LOCATIONS = 3000;

export function useBusRoutes() {
  return useQuery<BusRoute[]>({
    queryKey: ['bus-routes'],
    queryFn: async () => {
      if (isDevMode()) return MockData.getBusRoutes();
      return repository.getRoutes();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useRouteStops(routeId: string) {
  return useQuery<BusStop[]>({
    queryKey: ['bus-stops', routeId],
    queryFn: async () => {
      if (isDevMode()) return MockData.getBusStops(routeId);
      return repository.getRouteStops(routeId);
    },
    enabled: !!routeId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBusLocations(routeId: string) {
  const queryClient = useQueryClient();
  const battery = useBatteryOptimizer();
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localLocations, setLocalLocations] = useState<BusLocation[]>([]);

  const query = useQuery<BusLocation[]>({
    queryKey: ['bus-locations', routeId],
    queryFn: async () => {
      if (isDevMode()) return MockData.getBusLocations(routeId);
      const cached = geoCache.get<BusLocation[]>(`bl:${routeId}`);
      if (cached) return cached;

      const data = await repository.getBusLocations(routeId);
      geoCache.set(`bl:${routeId}`, data, CACHE_TTL_BUS_LOCATIONS);
      return data;
    },
    enabled: !!routeId,
    staleTime: battery.throttleMs,
  });

  useEffect(() => {
    if (!routeId) return;

    const channel = subscribeToBusLocations(routeId, (payload) => {
      if (throttleRef.current) return;

      throttleRef.current = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['bus-locations', routeId] });
        geoCache.delete(`bl:${routeId}`);
        throttleRef.current = null;
      }, battery.throttleMs);
    });

    return () => {
      unsubscribeChannel(channel);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [routeId, queryClient, battery.throttleMs]);

  useEffect(() => {
    if (query.data) {
      setLocalLocations(query.data);
    }
  }, [query.data]);

  return {
    ...query,
    data: localLocations.length > 0 ? localLocations : query.data,
    batteryLevel: battery.batteryLevel,
  };
}

export function useOptimizedRoutePolyline(stops: BusStop[] | undefined) {
  return useMemo(() => {
    if (!stops || stops.length < 2) return null;

    const points: GeoCoordinate[] = stops.map((s) => ({
      latitude: s.latitude,
      longitude: s.longitude,
    }));

    const simplified = douglasPeuckerSimplify(points, POLYLINE_SIMPLIFY_TOLERANCE_M);

    return {
      originalPoints: points,
      simplifiedPoints: simplified,
      distance: calculateRouteDistance(points),
      reductionPercent:
        points.length > 0
          ? (((points.length - simplified.length) / points.length) * 100).toFixed(0)
          : '0',
    };
  }, [stops]);
}

export function useBusEta(busLocation: BusLocation | null, stops: BusStop[] | undefined) {
  return useMemo(() => {
    if (!busLocation || !stops || stops.length === 0) return null;

    const stopCoords: GeoCoordinate[] = stops.map((s) => ({
      latitude: s.latitude,
      longitude: s.longitude,
    }));

    const busCoord: GeoCoordinate = {
      latitude: busLocation.latitude,
      longitude: busLocation.longitude,
    };

    let nearestStopIdx = 0;
    let minDist = Infinity;

    for (let i = 0; i < stopCoords.length; i++) {
      const dist = haversineDist(busCoord, stopCoords[i]);
      if (dist < minDist) {
        minDist = dist;
        nearestStopIdx = i;
      }
    }

    const etaMinutes = calculateETA(stopCoords, nearestStopIdx, 30);

    return {
      nearestStop: stops[nearestStopIdx]?.name ?? null,
      etaMinutes: Math.round(etaMinutes),
      remainingStops: stops.length - nearestStopIdx - 1,
    };
  }, [busLocation, stops]);
}

function haversineDist(a: GeoCoordinate, b: GeoCoordinate): number {
  const R = 6_371_000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const sDLat = Math.sin(dLat / 2);
  const sDLon = Math.sin(dLon / 2);
  const h = sDLat * sDLat + Math.cos(lat1) * Math.cos(lat2) * sDLon * sDLon;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function useBusInterpolation(
  busLocation: BusLocation | null,
  animationEnabled: boolean = true
) {
  const previousLocation = useRef<GeoCoordinate | null>(null);
  const [interpolated, setInterpolated] = useState<GeoCoordinate | null>(null);

  useEffect(() => {
    if (!busLocation || !animationEnabled) {
      setInterpolated(
        busLocation
          ? { latitude: busLocation.latitude, longitude: busLocation.longitude }
          : null
      );
      return;
    }

    const current: GeoCoordinate = {
      latitude: busLocation.latitude,
      longitude: busLocation.longitude,
    };

    if (previousLocation.current) {
      const steps = 10;
      let step = 0;

      const animate = () => {
        if (step >= steps) {
          previousLocation.current = current;
          return;
        }

        const t = step / steps;
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        setInterpolated({
          latitude:
            previousLocation.current!.latitude +
            (current.latitude - previousLocation.current!.latitude) * eased,
          longitude:
            previousLocation.current!.longitude +
            (current.longitude - previousLocation.current!.longitude) * eased,
        });

        step++;
        requestAnimationFrame(animate);
      };

      animate();
    } else {
      previousLocation.current = current;
      setInterpolated(current);
    }
  }, [busLocation, animationEnabled]);

  return interpolated;
}
