import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url().optional().default(''),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().default(''),
  EXPO_PUBLIC_DEV_MODE: z.string().optional().default('true'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  let url = '';
  let key = '';
  let devMode = 'true';

  try {
    url = String(process.env.EXPO_PUBLIC_SUPABASE_URL ?? '');
    key = String(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '');
    devMode = String(process.env.EXPO_PUBLIC_DEV_MODE ?? 'true');
  } catch {
    // Env vars not available at module evaluation time
  }

  const result = envSchema.safeParse({
    EXPO_PUBLIC_SUPABASE_URL: url,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: key,
    EXPO_PUBLIC_DEV_MODE: devMode,
  });

  if (!result.success) {
    return { EXPO_PUBLIC_SUPABASE_URL: '', EXPO_PUBLIC_SUPABASE_ANON_KEY: '', EXPO_PUBLIC_DEV_MODE: 'true' };
  }

  return result.data;
}

export const env = loadEnv();

export const isDevMode = (): boolean => {
  return env.EXPO_PUBLIC_DEV_MODE === 'true';
};
