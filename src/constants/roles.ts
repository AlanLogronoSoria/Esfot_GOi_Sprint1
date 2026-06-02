import type { Role } from '@/core/types';

export const ROLES: Record<Role, { label: string; permissions: string[] }> = {
  estudiante: {
    label: 'Estudiante',
    permissions: ['read:events', 'read:bus_routes', 'read:campus', 'update:profile'],
  },
  docente: {
    label: 'Docente',
    permissions: [
      'read:events',
      'create:events',
      'update:events',
      'read:bus_routes',
      'read:campus',
      'update:profile',
    ],
  },
  administrador: {
    label: 'Administrador',
    permissions: [
      'read:events',
      'create:events',
      'update:events',
      'delete:events',
      'read:bus_routes',
      'create:bus_routes',
      'update:bus_routes',
      'delete:bus_routes',
      'read:campus',
      'create:campus',
      'update:campus',
      'delete:campus',
      'update:profile',
      'manage:users',
    ],
  },
} as const;

export const ROLE_HIERARCHY: Record<Role, number> = {
  administrador: 3,
  docente: 2,
  estudiante: 1,
};

export function hasPermission(role: Role, permission: string): boolean {
  return ROLES[role]?.permissions.includes(permission) ?? false;
}

export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}
