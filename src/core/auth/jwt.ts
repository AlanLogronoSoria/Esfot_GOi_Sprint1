interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

interface JwtValidationResult {
  valid: boolean;
  expired: boolean;
  payload: JwtPayload | null;
  error: string | null;
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  try {
    return decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return atob(padded);
  }
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export function validateJwt(token: string): JwtValidationResult {
  if (!token || token.split('.').length !== 3) {
    return { valid: false, expired: false, payload: null, error: 'Token malformado' };
  }

  const payload = decodeJwt(token);

  if (!payload) {
    return { valid: false, expired: false, payload: null, error: 'Token inválido' };
  }

  if (payload.exp) {
    const now = Math.floor(Date.now() / 1000);
    const expired = payload.exp < now;

    if (expired) {
      return {
        valid: false,
        expired: true,
        payload,
        error: 'Token expirado',
      };
    }
  }

  return {
    valid: true,
    expired: false,
    payload,
    error: null,
  };
}

export function getTokenExpiry(token: string): Date | null {
  const payload = decodeJwt(token);
  if (!payload?.exp) return null;
  return new Date(payload.exp * 1000);
}

export function getTokenTimeRemaining(token: string): number {
  const expiry = getTokenExpiry(token);
  if (!expiry) return Infinity;
  return Math.max(0, expiry.getTime() - Date.now());
}

export function isTokenExpiringSoon(token: string, thresholdMs: number = 5 * 60 * 1000): boolean {
  const remaining = getTokenTimeRemaining(token);
  return remaining < thresholdMs;
}

export function extractJwtClaims(token: string): {
  userId: string | null;
  email: string | null;
  role: string | null;
} {
  const payload = decodeJwt(token);
  return {
    userId: payload?.sub ?? null,
    email: (payload?.email as string) ?? null,
    role: (payload?.user_metadata as Record<string, unknown> | undefined)?.role as string
      ?? (payload?.role as string)
      ?? null,
  };
}
