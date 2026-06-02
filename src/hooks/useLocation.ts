import * as Location from 'expo-location';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useBatteryOptimizer } from '@/features/map/services/battery-optimizer';
import { isDevMode } from '@/core/config/env';

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
}

interface UseLocationReturn {
  location: Location.LocationObject | null;
  error: string | null;
  isWatching: boolean;
  retry: () => void;
}

const DEV_MOCK_LOCATION: Location.LocationObject = {
  coords: {
    latitude: -0.2105,
    longitude: -78.4895,
    altitude: 2800,
    accuracy: 10,
    altitudeAccuracy: 5,
    heading: 0,
    speed: 0,
  },
  timestamp: Date.now(),
};

export function useLocation(options?: UseLocationOptions): UseLocationReturn {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const subRef = useRef<Location.LocationSubscription | null>(null);
  const mountedRef = useRef(true);
  const lastUpdateRef = useRef(0);
  const battery = useBatteryOptimizer();

  const cleanup = useCallback(() => {
    try {
      subRef.current?.remove();
    } catch {
      // already removed
    }
    subRef.current = null;
  }, []);

  const startWatching = useCallback(async () => {
    try {
      cleanup();
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (mountedRef.current) {
          setError('Permiso de ubicación denegado');
        }
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (mountedRef.current) {
        setLocation(loc);
        lastUpdateRef.current = Date.now();
      }

      subRef.current = await Location.watchPositionAsync(
        {
          accuracy: battery.isLowPower
            ? Location.Accuracy.Balanced
            : Location.Accuracy.High,
          distanceInterval: battery.isLowPower ? 15 : 5,
          timeInterval: battery.throttleMs,
        },
        (newLoc) => {
          const now = Date.now();
          if (now - lastUpdateRef.current < battery.throttleMs) return;
          lastUpdateRef.current = now;

          if (mountedRef.current) {
            setLocation(newLoc);
          }
        }
      );

      if (mountedRef.current) {
        setIsWatching(true);
        setError(null);
      }
    } catch (e) {
      if (mountedRef.current) {
        setError((e as Error).message ?? 'Error al obtener ubicación');
      }
    }
  }, [cleanup, battery.isLowPower, battery.throttleMs]);

  useEffect(() => {
    mountedRef.current = true;

    if (isDevMode()) {
      setLocation(DEV_MOCK_LOCATION);
      setIsWatching(true);

      const interval = setInterval(() => {
        const jitter = 0.0001 * (Math.random() - 0.5);
        setLocation((prev) =>
          prev
            ? {
                ...prev,
                coords: {
                  ...prev.coords,
                  latitude: prev.coords.latitude + jitter,
                  longitude: prev.coords.longitude + jitter * 1.3,
                },
                timestamp: Date.now(),
              }
            : null
        );
      }, 3000);

      return () => {
        mountedRef.current = false;
        clearInterval(interval);
        cleanup();
      };
    }

    startWatching();

    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [retryCount, startWatching, cleanup]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
    setError(null);
  }, []);

  return { location, error, isWatching, retry };
}
