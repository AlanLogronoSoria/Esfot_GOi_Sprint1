import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';

export function useLocation(options?: { enableHighAccuracy?: boolean }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const subRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission denied');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        if (!mounted) return;
        setLocation(loc);
        subRef.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 5 },
          (l) => {
            setLocation(l);
          }
        );
      } catch (e: any) {
        setError(e.message);
      }
    })();

    return () => {
      mounted = false;
      try {
        subRef.current?.remove();
      } catch {}
    };
  }, []);

  return { location, error };
}

