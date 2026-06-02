import type { User, Role } from '@/core/types';

export class UserEntity implements User {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  avatarUrl: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;

  constructor(user: User) {
    this.id = user.id ?? '';
    this.email = user.email ?? '';
    this.fullName = user.fullName ?? null;
    this.role = user.role ?? 'estudiante';
    this.avatarUrl = user.avatarUrl ?? null;
    this.phone = user.phone ?? null;
    this.createdAt = user.createdAt ?? new Date().toISOString();
    this.updatedAt = user.updatedAt ?? new Date().toISOString();
  }

  get displayName(): string {
    if (this.fullName && this.fullName.trim().length > 0) {
      return this.fullName;
    }
    if (this.email && this.email.includes('@')) {
      return this.email.split('@')[0];
    }
    return this.email || 'Usuario';
  }

  get initials(): string {
    if (this.fullName && this.fullName.trim().length > 0) {
      return this.fullName
        .split(' ')
        .map((n) => n[0] ?? '')
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (this.email && this.email.length > 0) {
      return this.email[0].toUpperCase();
    }
    return 'U';
  }

  get isAdmin(): boolean {
    return this.role === 'administrador';
  }

  get isTeacher(): boolean {
    return this.role === 'docente';
  }

  get isStudent(): boolean {
    return this.role === 'estudiante';
  }
}
