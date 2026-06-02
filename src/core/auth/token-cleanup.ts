import { supabase } from '@/core/config/supabase';
import { SessionManager } from './session-manager';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class TokenCleanupService {
  static async executeServerSideSignOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        await supabase.auth.signOut({ scope: 'local' });
      }
    } catch {
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
        // Last resort: force local cleanup
      }
    }
  }

  static async clearQueryCache(queryClient?: { clear: () => void }): Promise<void> {
    try {
      queryClient?.clear();
    } catch {
      // Best effort
    }
  }

  static async clearExpressSession(): Promise<void> {
    const expressKeys = ['epn_express_token', 'epn_express_user'];
    for (const key of expressKeys) {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // Key may not exist
      }
    }
  }

  static async clearSupabaseStorage(): Promise<void> {
    const supabaseKeys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.expires_at',
      'supabase.auth.expires_in',
      'supabase.auth.provider_token',
      'supabase.auth.provider_refresh_token',
    ];
    for (const key of supabaseKeys) {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // Key may not exist
      }
    }
  }

  static async clearApplicationCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const epnKeys = keys.filter(
        (k) =>
          k.startsWith('epn_') ||
          k.startsWith('supabase.') ||
          k.includes('auth') ||
          k.includes('token')
      );
      if (epnKeys.length > 0) {
        await AsyncStorage.multiRemove(epnKeys);
      }
    } catch {
      // Best effort
    }
  }

  static async invalidateRemoteSession(): Promise<void> {
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch {
      // Best effort
    }
  }

  static async performSecureLogout(queryClient?: { clear: () => void }): Promise<void> {
    const tasks: Promise<void>[] = [
      this.executeServerSideSignOut(),
      this.clearSupabaseStorage(),
      this.clearExpressSession(),
      this.clearApplicationCache(),
      SessionManager.performFullCleanup(),
      this.clearQueryCache(queryClient),
    ];

    await Promise.allSettled(tasks);
  }

  static async performFullInvalidation(queryClient?: { clear: () => void }): Promise<void> {
    await this.invalidateRemoteSession();
    await this.performSecureLogout(queryClient);
  }
}
