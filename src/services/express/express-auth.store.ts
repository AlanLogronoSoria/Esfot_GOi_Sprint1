import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { ExpressAuthRepository } from '@/services/express/express-repositories';
import type { ExpressUser, ExpressLoginInput } from '@/services/express/express-types';

const EXPRESS_TOKEN_KEY = 'epn_express_token';
const EXPRESS_USER_KEY = 'epn_express_user';

interface ExpressAuthState {
  expressUser: ExpressUser | null;
  expressToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  initializeExpress: () => Promise<void>;
  loginEstudiante: (input: ExpressLoginInput) => Promise<ExpressUser>;
  loginAdmin: (input: ExpressLoginInput) => Promise<ExpressUser>;
  logoutExpress: () => Promise<void>;
  loadStoredExpressSession: () => Promise<ExpressUser | null>;
  getExpressToken: () => string | null;
}

const authRepo = new ExpressAuthRepository();

export const useExpressAuthStore = create<ExpressAuthState>((set, get) => ({
  expressUser: null,
  expressToken: null,
  isLoading: false,
  isInitialized: false,

  initializeExpress: async () => {
    try {
      set({ isLoading: true });
      const user = await get().loadStoredExpressSession();
      if (user) {
        set({ expressUser: user });
      }
    } catch {
      // No stored session
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  loginEstudiante: async (input: ExpressLoginInput) => {
    set({ isLoading: true });
    try {
      const res = await authRepo.loginEstudiante(input);
      if (res.error || !res.data) {
        throw new Error(res.error ?? 'Error al iniciar sesión');
      }

      const { token, user } = res.data;
      await SecureStore.setItemAsync(EXPRESS_TOKEN_KEY, token);
      await SecureStore.setItemAsync(EXPRESS_USER_KEY, JSON.stringify(user));
      set({ expressUser: user, expressToken: token });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  loginAdmin: async (input: ExpressLoginInput) => {
    set({ isLoading: true });
    try {
      const res = await authRepo.loginAdmin(input);
      if (res.error || !res.data) {
        throw new Error(res.error ?? 'Error al iniciar sesión');
      }

      const { token, user } = res.data;
      await SecureStore.setItemAsync(EXPRESS_TOKEN_KEY, token);
      await SecureStore.setItemAsync(EXPRESS_USER_KEY, JSON.stringify(user));
      set({ expressUser: user, expressToken: token });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  logoutExpress: async () => {
    try {
      await SecureStore.deleteItemAsync(EXPRESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(EXPRESS_USER_KEY);
    } catch {
      // Ignore
    }
    set({ expressUser: null, expressToken: null });
  },

  loadStoredExpressSession: async () => {
    try {
      const token = await SecureStore.getItemAsync(EXPRESS_TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(EXPRESS_USER_KEY);

      if (token && userJson) {
        const user = JSON.parse(userJson) as ExpressUser;
        set({ expressToken: token });
        return user;
      }
      return null;
    } catch {
      return null;
    }
  },

  getExpressToken: () => {
    return get().expressToken;
  },
}));
