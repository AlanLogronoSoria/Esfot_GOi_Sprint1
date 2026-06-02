import type { PoiEvent, PoiEventListener } from '../domain/poi.entity';
import type { CampusLocation } from '@/features/map/domain/location.entity';

class PoiEventBus {
  private listeners: Set<PoiEventListener> = new Set();
  private eventLog: PoiEvent[] = [];
  private maxLogSize = 100;

  subscribe(listener: PoiEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(type: PoiEvent['type'], poi: CampusLocation, userId: string): void {
    const event: PoiEvent = {
      type,
      poi,
      timestamp: new Date().toISOString(),
      userId,
    };

    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(-this.maxLogSize);
    }

    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {
        // Prevent one faulty listener from breaking others
      }
    }
  }

  getRecentEvents(count: number = 10): PoiEvent[] {
    return this.eventLog.slice(-count);
  }

  clear(): void {
    this.eventLog = [];
  }

  getListenerCount(): number {
    return this.listeners.size;
  }
}

export const poiEventBus = new PoiEventBus();
