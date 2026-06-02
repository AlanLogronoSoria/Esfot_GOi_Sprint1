import type { User } from '@/core/types';
import type { Event } from '@/features/events/domain/event.entity';
import type { CampusLocation } from '@/features/map/domain/location.entity';
import type { BusRoute, BusStop, BusLocation } from '@/features/polibus/domain/route.entity';
import type { ExpressUser, Aula, Oficina, ExpressEvento } from '@/services/express/express-types';
import type { ManagedUser } from '@/features/admin/domain/user-management.entity';

const now = new Date().toISOString();

// ─── Supabase Mock Data ───

export const MOCK_USER: User = {
  id: 'dev-user-001',
  email: 'juan.perez@epn.edu.ec',
  fullName: 'Juan Pérez',
  role: 'estudiante',
  avatarUrl: null,
  phone: '0991234567',
  createdAt: now,
  updatedAt: now,
};

export const MOCK_ADMIN_USER: User = {
  id: 'dev-admin-001',
  email: 'admin@epn.edu.ec',
  fullName: 'Administrador EPN',
  role: 'administrador',
  avatarUrl: null,
  phone: null,
  createdAt: now,
  updatedAt: now,
};

export const MOCK_DOCENTE_USER: User = {
  id: 'dev-docente-001',
  email: 'maria.lopez@epn.edu.ec',
  fullName: 'María López',
  role: 'docente',
  avatarUrl: null,
  phone: '0998765432',
  createdAt: now,
  updatedAt: now,
};

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-1', title: 'Feria de Tecnologías ESFOT 2026',
    description: 'Exposición de proyectos tecnológicos desarrollados por estudiantes de la Escuela de Formación de Tecnólogos.',
    imageUrl: 'https://picsum.photos/seed/evt1/800/400', location: 'Patio Central ESFOT',
    startDate: '2026-06-15T09:00:00Z', endDate: '2026-06-15T17:00:00Z',
    createdBy: 'dev-admin-001', organizer: 'Coordinación ESFOT',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'evt-2', title: 'Conferencia: Ciberseguridad en la Era Digital',
    description: 'Charla magistral sobre las últimas amenazas de ciberseguridad y cómo protegerse.',
    imageUrl: 'https://picsum.photos/seed/evt2/800/400', location: 'Auditorio Principal EPN',
    startDate: '2026-06-20T14:00:00Z', endDate: '2026-06-20T16:00:00Z',
    createdBy: 'dev-docente-001', organizer: 'Ing. Carlos Mendoza',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'evt-3', title: 'Taller de Desarrollo Mobile con React Native',
    description: 'Aprende a crear aplicaciones móviles multiplataforma. Taller práctico de 4 horas.',
    imageUrl: 'https://picsum.photos/seed/evt3/800/400', location: 'Laboratorio de Cómputo 3',
    startDate: '2026-06-25T08:00:00Z', endDate: '2026-06-25T12:00:00Z',
    createdBy: 'dev-admin-001', organizer: 'Depto. TI',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'evt-4', title: 'Jornada Deportiva Intercarreras',
    description: 'Competencias de fútbol, básquet y voleibol entre las diferentes carreras.',
    imageUrl: 'https://picsum.photos/seed/evt4/800/400', location: 'Canchas Deportivas EPN',
    startDate: '2026-07-01T08:00:00Z', endDate: '2026-07-03T18:00:00Z',
    createdBy: 'dev-admin-001', organizer: 'Bienestar Estudiantil',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'evt-5', title: 'Feria de Empleo y Pasantías ESFOT',
    description: 'Empresas tecnológicas ofrecerán vacantes y pasantías para estudiantes.',
    imageUrl: 'https://picsum.photos/seed/evt5/800/400', location: 'Hall Principal ESFOT',
    startDate: '2026-07-10T10:00:00Z', endDate: '2026-07-10T16:00:00Z',
    createdBy: 'dev-admin-001', organizer: 'Vinculación con la Sociedad',
    createdAt: now, updatedAt: now,
  },
];

export const MOCK_CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: 'loc-1', name: 'Edificio ESFOT', description: 'Edificio principal de la Escuela de Formación de Tecnólogos. Alberga aulas, laboratorios y oficinas administrativas.', category: 'academico', latitude: -0.2105, longitude: -78.4895, imageUrl: null, createdAt: now },
  { id: 'loc-2', name: 'Biblioteca Central', description: 'Biblioteca principal del campus con salas de estudio, computadoras y préstamo de libros.', category: 'biblioteca', latitude: -0.2102, longitude: -78.4890, imageUrl: null, createdAt: now },
  { id: 'loc-3', name: 'Comedor Politécnico', description: 'Comedor estudiantil con opciones de almuerzo subsidiado para estudiantes.', category: 'servicios', latitude: -0.2110, longitude: -78.4898, imageUrl: null, createdAt: now },
  { id: 'loc-4', name: 'Gimnasio EPN', description: 'Instalaciones deportivas con canchas de básquet, fútbol sala y gimnasio de pesas.', category: 'deportes', latitude: -0.2098, longitude: -78.4902, imageUrl: null, createdAt: now },
  { id: 'loc-5', name: 'Auditorio Principal', description: 'Auditorio para conferencias, ceremonias y eventos académicos. Capacidad 500 personas.', category: 'eventos', latitude: -0.2108, longitude: -78.4892, imageUrl: null, createdAt: now },
  { id: 'loc-6', name: 'Parqueadero Estudiantil', description: 'Estacionamiento exclusivo para estudiantes con capacidad para 200 vehículos.', category: 'estacionamiento', latitude: -0.2115, longitude: -78.4885, imageUrl: null, createdAt: now },
  { id: 'loc-7', name: 'Entrada Principal', description: 'Acceso principal al campus por la Av. Ladrón de Guevara.', category: 'entrada', latitude: -0.2095, longitude: -78.4910, imageUrl: null, createdAt: now },
  { id: 'loc-8', name: 'Laboratorios de Informática', description: 'Laboratorios equipados con computadoras de última generación para prácticas.', category: 'academico', latitude: -0.2106, longitude: -78.4897, imageUrl: null, createdAt: now },
];

export const MOCK_BUS_ROUTES: BusRoute[] = [
  { id: 'route-1', name: 'Ruta Campus - Norte', description: 'Recorrido desde la entrada principal hasta el norte del campus', color: '#1B6BB0', isActive: true, createdAt: now },
  { id: 'route-2', name: 'Ruta Campus - Sur', description: 'Recorrido circular por el sur del campus', color: '#059669', isActive: true, createdAt: now },
];

export const MOCK_BUS_STOPS: Record<string, BusStop[]> = {
  'route-1': [
    { id: 'stop-1a', routeId: 'route-1', name: 'Entrada Principal', latitude: -0.2095, longitude: -78.4910, stopOrder: 1, createdAt: now },
    { id: 'stop-1b', routeId: 'route-1', name: 'Edificio ESFOT', latitude: -0.2105, longitude: -78.4895, stopOrder: 2, createdAt: now },
    { id: 'stop-1c', routeId: 'route-1', name: 'Biblioteca', latitude: -0.2102, longitude: -78.4890, stopOrder: 3, createdAt: now },
    { id: 'stop-1d', routeId: 'route-1', name: 'Gimnasio', latitude: -0.2098, longitude: -78.4902, stopOrder: 4, createdAt: now },
    { id: 'stop-1e', routeId: 'route-1', name: 'Comedor', latitude: -0.2110, longitude: -78.4898, stopOrder: 5, createdAt: now },
  ],
  'route-2': [
    { id: 'stop-2a', routeId: 'route-2', name: 'Parqueadero', latitude: -0.2115, longitude: -78.4885, stopOrder: 1, createdAt: now },
    { id: 'stop-2b', routeId: 'route-2', name: 'Auditorio', latitude: -0.2108, longitude: -78.4892, stopOrder: 2, createdAt: now },
    { id: 'stop-2c', routeId: 'route-2', name: 'Edificio ESFOT', latitude: -0.2105, longitude: -78.4895, stopOrder: 3, createdAt: now },
    { id: 'stop-2d', routeId: 'route-2', name: 'Laboratorios', latitude: -0.2106, longitude: -78.4897, stopOrder: 4, createdAt: now },
  ],
};

export const MOCK_BUS_LOCATIONS: Record<string, BusLocation[]> = {
  'route-1': [
    { id: 'bus-1', routeId: 'route-1', busId: 'PB-001', latitude: -0.2103, longitude: -78.4893, heading: 45, updatedAt: now },
    { id: 'bus-2', routeId: 'route-1', busId: 'PB-002', latitude: -0.2099, longitude: -78.4900, heading: 180, updatedAt: now },
  ],
  'route-2': [
    { id: 'bus-3', routeId: 'route-2', busId: 'PB-003', latitude: -0.2112, longitude: -78.4889, heading: 90, updatedAt: now },
  ],
};

// ─── Express Mock Data ───

export const MOCK_EXPRESS_USER: ExpressUser = {
  _id: 'dev-express-001',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan.perez@epn.edu.ec',
  direccion: 'Av. Ladrón de Guevara E11-253',
  telefono: '0991234567',
  rol: 'estudiante',
};

export const MOCK_EXPRESS_ADMIN: ExpressUser = {
  _id: 'dev-express-admin',
  nombre: 'Admin',
  apellido: 'EPN',
  email: 'admin@epn.edu.ec',
  rol: 'admin',
};

export const MOCK_AULAS: Aula[] = [
  { _id: 'aula-1', nombre: 'Laboratorio de Cómputo 1', capacidad: 30, ubicacion: 'Edificio ESFOT - Piso 1', estado: 'disponible' },
  { _id: 'aula-2', nombre: 'Laboratorio de Cómputo 2', capacidad: 25, ubicacion: 'Edificio ESFOT - Piso 1', estado: 'disponible' },
  { _id: 'aula-3', nombre: 'Aula Magna', capacidad: 100, ubicacion: 'Edificio ESFOT - Piso 2', estado: 'disponible' },
  { _id: 'aula-4', nombre: 'Sala de Estudio Grupal', capacidad: 15, ubicacion: 'Biblioteca Central', estado: 'ocupado' },
  { _id: 'aula-5', nombre: 'Laboratorio de Redes', capacidad: 20, ubicacion: 'Edificio ESFOT - Piso 3', estado: 'disponible' },
  { _id: 'aula-6', nombre: 'Laboratorio de IoT', capacidad: 20, ubicacion: 'Edificio ESFOT - Piso 3', estado: 'mantenimiento' },
];

export const MOCK_OFICINAS: Oficina[] = [
  { _id: 'ofi-1', nombre: 'Secretaría ESFOT', descripcion: 'Trámites administrativos, matrículas y certificados', ubicacion: 'Edificio ESFOT - Planta Baja', horario: '08:00 - 16:00' },
  { _id: 'ofi-2', nombre: 'Coordinación Académica', descripcion: 'Coordinación de carreras y horarios', ubicacion: 'Edificio ESFOT - Piso 1', horario: '09:00 - 17:00' },
  { _id: 'ofi-3', nombre: 'Bienestar Estudiantil', descripcion: 'Becas, seguro estudiantil y orientación', ubicacion: 'Edificio ESFOT - Planta Baja', horario: '08:00 - 16:00' },
  { _id: 'ofi-4', nombre: 'Departamento de TI', descripcion: 'Soporte técnico y servicios informáticos', ubicacion: 'Edificio ESFOT - Piso 2', horario: '08:00 - 17:00' },
  { _id: 'ofi-5', nombre: 'Vinculación con la Sociedad', descripcion: 'Programas de vinculación y prácticas pre-profesionales', ubicacion: 'Edificio ESFOT - Piso 1', horario: '09:00 - 16:00' },
];

export const MOCK_EXPRESS_EVENTOS: ExpressEvento[] = [
  { _id: 'ex-evt-1', nombre: 'Feria de Tecnologías 2026', informacion: 'Exposición de proyectos tecnológicos', ubicacion: 'Patio Central ESFOT', fecha: '2026-06-15', hora: '09:00', organizador: 'Coordinación ESFOT' },
  { _id: 'ex-evt-2', nombre: 'Conferencia Ciberseguridad', informacion: 'Charla sobre amenazas digitales', ubicacion: 'Auditorio Principal', fecha: '2026-06-20', hora: '14:00', organizador: 'Depto. TI' },
];

export const MOCK_MANAGED_USERS: ManagedUser[] = [
  { _id: 'mu-1', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@epn.edu.ec', direccion: 'Av. Siempre Viva 123', telefono: '0991234567', rol: 'estudiante', status: 'activo', type: 'estudiante' },
  { _id: 'mu-2', nombre: 'Ana', apellido: 'García', email: 'ana.garcia@epn.edu.ec', direccion: 'Calle Principal 456', telefono: '0992345678', rol: 'estudiante', status: 'activo', type: 'estudiante' },
  { _id: 'mu-3', nombre: 'Carlos', apellido: 'Martínez', email: 'carlos.martinez@epn.edu.ec', rol: 'estudiante', status: 'inactivo', type: 'estudiante' },
  { _id: 'mu-4', nombre: 'Diana', apellido: 'Rodríguez', email: 'diana.rodriguez@epn.edu.ec', telefono: '0993456789', rol: 'estudiante', status: 'activo', type: 'estudiante' },
  { _id: 'mu-5', nombre: 'María', apellido: 'López', email: 'maria.lopez@epn.edu.ec', direccion: 'Av. Ladrón de Guevara', telefono: '0998765432', rol: 'docente', status: 'activo', type: 'docente' },
  { _id: 'mu-6', nombre: 'Pedro', apellido: 'Ramírez', email: 'pedro.ramirez@epn.edu.ec', rol: 'docente', status: 'activo', type: 'docente' },
  { _id: 'mu-7', nombre: 'Sofía', apellido: 'Torres', email: 'sofia.torres@epn.edu.ec', telefono: '0995678901', rol: 'docente', status: 'inactivo', type: 'docente' },
  { _id: 'mu-8', nombre: 'Admin', apellido: 'EPN', email: 'admin@epn.edu.ec', rol: 'administrador', status: 'activo', type: 'docente' },
];

// ─── Test Credentials ───

export const TEST_CREDENTIALS = {
  estudiante: { email: 'juan.perez@epn.edu.ec', password: 'Test123!' },
  docente: { email: 'maria.lopez@epn.edu.ec', password: 'Test123!' },
  admin: { email: 'admin@epn.edu.ec', password: 'Test123!' },
} as const;
