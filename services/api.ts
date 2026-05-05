import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'EPN_APP_TOKEN';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function apiRequest<T = any>(path: string, options?: { method?: string; body?: any }): Promise<{ data: T }> {
  // Simulated request wrapper that injects token header
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  await delay();
  // This is a stub. Replace with fetch() to call a real backend.
  return { data: { path, method: options?.method ?? 'GET', token: token ?? null, body: options?.body ?? null } as any };
}

export default { apiRequest };
