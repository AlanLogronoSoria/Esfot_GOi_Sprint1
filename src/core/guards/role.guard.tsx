import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { hasMinimumRole } from '@/constants/roles';
import type { Role } from '@/core/types';

export function useRoleGuard(allowedRoles: Role[]): boolean {
  const user = useAuthStore((state) => state.user);

  if (!user) return false;

  return allowedRoles.some((role) => hasMinimumRole(user.role, role));
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}) {
  const hasAccess = useRoleGuard(allowedRoles);

  if (!hasAccess) {
    if (fallback) return fallback as React.ReactElement;
    return <Redirect href="/(drawer)" />;
  }

  return children as React.ReactElement;
}
