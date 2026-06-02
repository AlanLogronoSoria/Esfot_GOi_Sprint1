import { isDevMode } from '@/core/config/env';
import {
  MOCK_USER,
  MOCK_ADMIN_USER,
  MOCK_DOCENTE_USER,
  MOCK_EVENTS,
  MOCK_CAMPUS_LOCATIONS,
  MOCK_BUS_ROUTES,
  MOCK_BUS_STOPS,
  MOCK_BUS_LOCATIONS,
  MOCK_EXPRESS_USER,
  MOCK_EXPRESS_ADMIN,
  MOCK_AULAS,
  MOCK_OFICINAS,
  MOCK_EXPRESS_EVENTOS,
  MOCK_MANAGED_USERS,
} from './mock-data';
import type { User } from '@/core/types';
import type { Event } from '@/features/events/domain/event.entity';
import type { CampusLocation } from '@/features/map/domain/location.entity';
import type { BusRoute, BusStop, BusLocation } from '@/features/polibus/domain/route.entity';
import type { ExpressUser, Aula, Oficina, ExpressEvento } from '@/services/express/express-types';
import type { ManagedUser, ManagedUserType } from '@/features/admin/domain/user-management.entity';

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Mock Supabase Auth ───

export const MockSupabaseAuth = {
  async signIn(email: string, _password: string): Promise<{ user: User; token: string }> {
    await delay(500);

    if (email.includes('admin')) {
      return { user: MOCK_ADMIN_USER, token: 'mock-jwt-admin-token-dev' };
    }
    if (email.includes('maria') || email.includes('lopez')) {
      return { user: MOCK_DOCENTE_USER, token: 'mock-jwt-docente-token-dev' };
    }
    return { user: MOCK_USER, token: 'mock-jwt-estudiante-token-dev' };
  },

  async getSession(): Promise<{ user: User; token: string } | null> {
    await delay(100);
    return null;
  },

  async signOut(): Promise<void> {
    await delay(200);
  },
};

// ─── Mock Express Auth ───

export const MockExpressAuth = {
  async loginEstudiante(_email: string, _password: string): Promise<{ token: string; user: ExpressUser }> {
    await delay(400);
    return { token: 'mock-express-jwt-dev', user: MOCK_EXPRESS_USER };
  },

  async loginAdmin(_email: string, _password: string): Promise<{ token: string; user: ExpressUser }> {
    await delay(400);
    return { token: 'mock-express-jwt-admin-dev', user: MOCK_EXPRESS_ADMIN };
  },
};

// ─── Mock Data Access ───

export const MockData = {
  async getEvents(): Promise<{ data: Event[]; count: number }> {
    await delay(300);
    return { data: MOCK_EVENTS, count: MOCK_EVENTS.length };
  },

  async getCampusLocations(): Promise<CampusLocation[]> {
    await delay(200);
    return MOCK_CAMPUS_LOCATIONS;
  },

  async getBusRoutes(): Promise<BusRoute[]> {
    await delay(200);
    return MOCK_BUS_ROUTES;
  },

  async getBusStops(routeId: string): Promise<BusStop[]> {
    await delay(150);
    return MOCK_BUS_STOPS[routeId] ?? [];
  },

  async getBusLocations(routeId: string): Promise<BusLocation[]> {
    await delay(100);
    return MOCK_BUS_LOCATIONS[routeId] ?? [];
  },

  async getAulas(): Promise<Aula[]> {
    await delay(250);
    return MOCK_AULAS;
  },

  async getOficinas(): Promise<Oficina[]> {
    await delay(250);
    return MOCK_OFICINAS;
  },

  async getExpressEventos(): Promise<ExpressEvento[]> {
    await delay(200);
    return MOCK_EXPRESS_EVENTOS;
  },

  async getManagedUsers(type?: ManagedUserType): Promise<ManagedUser[]> {
    await delay(300);
    if (type) return MOCK_MANAGED_USERS.filter((u) => u.type === type);
    return MOCK_MANAGED_USERS;
  },
};

export function useDevMode(): boolean {
  return isDevMode();
}
