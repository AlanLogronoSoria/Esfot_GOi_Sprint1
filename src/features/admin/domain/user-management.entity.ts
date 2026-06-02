export type ManagedUserRole = 'estudiante' | 'docente' | 'administrador';
export type ManagedUserStatus = 'activo' | 'inactivo';
export type ManagedUserType = 'estudiante' | 'docente';

export interface ManagedUser {
  _id: string;
  nombre: string;
  apellido?: string;
  email: string;
  direccion?: string;
  telefono?: string;
  rol: ManagedUserRole;
  status: ManagedUserStatus;
  type: ManagedUserType;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFiltersState {
  search: string;
  type: ManagedUserType | 'todos';
  status: ManagedUserStatus | 'todos';
}

export interface PaginatedUsers {
  data: ManagedUser[];
  total: number;
  page: number;
  totalPages: number;
}
