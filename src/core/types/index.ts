import type { AppError } from '@/core/errors/app-error';

export type Role = 'estudiante' | 'docente' | 'administrador';

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  avatarUrl: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AuthSession = {
  user: User;
  token: string;
} | null;

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Nullable<T> = T | null;

export type AsyncResult<T> = Promise<{ data: T | null; error: AppError | null }>;
