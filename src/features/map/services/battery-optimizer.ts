import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

interface BatteryState {
  level: number;
  isLowPower: boolean;
}

export function useBatteryOptimizer() {
  const [battery, setBattery] = useState<BatteryState>({
    level: 1,
    isLowPower: false,
  });

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const checkBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          const batteryManager = await (
            navigator as Navigator & {
              getBattery?: () => Promise<{
                level: number;
                charging: boolean;
                addEventListener: (t: string, cb: () => void) => void;
              }>;
            }
          ).getBattery?.();

          if (batteryManager) {
            setBattery({
              level: batteryManager.level,
              isLowPower: batteryManager.level < 0.2 && !batteryManager.charging,
            });
          }
        }
      } catch {
        // Battery API not available
      }
    };

    checkBattery();
    interval = setInterval(checkBattery, 60_000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const getThrottleMs = useCallback((): number => {
    if (battery.level < 0.1) return 3000;
    if (battery.level < 0.2) return 2000;
    if (battery.level < 0.5) return 1000;
    return 500;
  }, [battery.level]);

  const shouldForceCluster = useCallback((): boolean => {
    return battery.level < 0.15;
  }, [battery.level]);

  const shouldSkipAnimation = useCallback((): boolean => {
    return battery.level < 0.1;
  }, [battery.level]);

  return {
    batteryLevel: battery.level,
    isLowPower: battery.isLowPower,
    throttleMs: getThrottleMs(),
    getThrottleMs,
    shouldForceCluster,
    shouldSkipAnimation,
  };
}
