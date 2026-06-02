import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'epn_session_meta';
const CACHE_PREFIX = 'epn_cache_';

export interface SessionMetadata {
  lastActiveAt: string;
  deviceId: string | null;
  loginMethod: 'email' | 'sso';
  rememberMe: boolean;
}

export class SessionManager {
  static async persistMetadata(metadata: SessionMetadata): Promise<void> {
    try {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(metadata));
    } catch {
      // Non-critical, silently fail
    }
  }

  static async getMetadata(): Promise<SessionMetadata | null> {
    try {
      const data = await AsyncStorage.getItem(SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data) as SessionMetadata;
    } catch {
      return null;
    }
  }

  static async updateLastActive(): Promise<void> {
    try {
      const meta = await this.getMetadata();
      if (meta) {
        meta.lastActiveAt = new Date().toISOString();
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(meta));
      }
    } catch {
      // Non-critical
    }
  }

  static async isSessionTimedOut(timeoutMinutes: number = 30): Promise<boolean> {
    try {
      const meta = await this.getMetadata();
      if (!meta || !meta.rememberMe) {
        return timeoutMinutes > 0;
      }
      const lastActive = new Date(meta.lastActiveAt).getTime();
      const now = Date.now();
      return now - lastActive > timeoutMinutes * 60 * 1000;
    } catch {
      return false;
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);

      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch {
      // Best effort
    }
  }

  static async clearSecureTokens(): Promise<void> {
    const secureKeys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'epn_jwt_token',
    ];

    for (const key of secureKeys) {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // Key might not exist
      }
    }
  }

  static async performFullCleanup(): Promise<void> {
    await Promise.all([
      this.clearAll(),
      this.clearSecureTokens(),
    ]);
  }
}
