import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  email: string;
  name?: string;
};

const TOKEN_KEY = 'EPN_APP_TOKEN';
const USER_KEY = 'EPN_APP_USER';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function signInAPI(email: string, password: string): Promise<{ token: string; user: User }> {
  await delay(700);
  if (!email || !password) throw new Error('Credenciales inválidas');
  const token = 'fake-jwt.' + encodeURIComponent(email + ':' + Date.now());
  const user: User = { id: '1', email, name: 'Usuario EPN' };
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user };
}

export async function signUpAPI(email: string, password: string): Promise<{ token: string; user: User }> {
  await delay(900);
  if (!email || !password) throw new Error('Datos inválidos');
  const token = 'fake-jwt.' + encodeURIComponent(email + ':' + Date.now());
  const user: User = { id: String(Date.now()), email, name: 'Nuevo Usuario' };
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user };
}

export async function signOutAPI() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}

export async function getStoredAuth(): Promise<{ token: string | null; user: User | null }> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const userStr = await AsyncStorage.getItem(USER_KEY);
  const user = userStr ? (JSON.parse(userStr) as User) : null;
  return { token, user };
}

export async function updateProfileAPI(payload: Partial<User>): Promise<User> {
  const stored = await getStoredAuth();
  const updated = { ...(stored.user ?? {}), ...payload } as User;
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}

export async function changePasswordAPI(_oldPassword: string, _newPassword: string): Promise<boolean> {
  await delay(500);
  // In a real API we'd validate the old password. Here we always succeed.
  return true;
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export default {
  signInAPI,
  signUpAPI,
  signOutAPI,
  getStoredAuth,
  updateProfileAPI,
  changePasswordAPI,
  getToken,
};
