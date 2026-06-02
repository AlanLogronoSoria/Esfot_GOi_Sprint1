import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { Tutoria } from '../domain/tutoria.entity';
import { isDevMode } from '@/core/config/env';

const now = new Date().toISOString();

const MOCK_TUTORIAS: Tutoria[] = [
  {
    id: 'tut-1', title: 'Cálculo Diferencial', subject: 'Matemáticas',
    description: 'Repaso de límites, derivadas y aplicaciones. Preparación para el examen parcial.',
    date: '2026-06-18', time: '14:00', duration: 90, location: 'Aula 101 - ESFOT',
    maxStudents: 20, enrolledCount: 12, status: 'programada', createdAt: now,
  },
  {
    id: 'tut-2', title: 'Programación en Python', subject: 'Programación',
    description: 'Introducción a estructuras de datos: listas, diccionarios, conjuntos.',
    date: '2026-06-20', time: '10:00', duration: 120, location: 'Lab Cómputo 2',
    maxStudents: 15, enrolledCount: 8, status: 'programada', createdAt: now,
  },
  {
    id: 'tut-3', title: 'Circuitos Eléctricos', subject: 'Electrónica',
    description: 'Análisis de circuitos RLC y leyes de Kirchhoff.',
    date: '2026-06-15', time: '16:00', duration: 60, location: 'Lab Electrónica',
    maxStudents: 12, enrolledCount: 12, status: 'finalizada', createdAt: now,
  },
  {
    id: 'tut-4', title: 'Base de Datos SQL', subject: 'Bases de Datos',
    description: 'Consultas avanzadas: JOINs, subconsultas, índices y optimización.',
    date: '2026-06-22', time: '09:00', duration: 120, location: 'Lab Cómputo 1',
    maxStudents: 25, enrolledCount: 15, status: 'programada', createdAt: now,
  },
  {
    id: 'tut-5', title: 'Redes de Computadoras', subject: 'Redes',
    description: 'Modelo OSI, TCP/IP, configuración de routers y switches.',
    date: '2026-06-25', time: '11:00', duration: 90, location: 'Lab Redes',
    maxStudents: 18, enrolledCount: 5, status: 'programada', createdAt: now,
  },
];

async function fetchMockTutorias(): Promise<Tutoria[]> {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_TUTORIAS;
}

export function useTutorias() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Tutoria['status'] | 'todas'>('todas');
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tutorias'],
    queryFn: async () => {
      if (isDevMode()) return fetchMockTutorias();
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const filtered = useMemo(() => {
    let result = query.data ?? [];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          (t.description ?? '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'todas') {
      result = result.filter((t) => t.status === statusFilter);
    }
    return result;
  }, [query.data, search, statusFilter]);

  const createTutoria = useMutation({
    mutationFn: async (input: Omit<Tutoria, 'id' | 'createdAt' | 'enrolledCount'>) => {
      if (isDevMode()) {
        const newTutoria: Tutoria = {
          ...input,
          id: `tut-${Date.now()}`,
          enrolledCount: 0,
          createdAt: new Date().toISOString(),
        };
        MOCK_TUTORIAS.unshift(newTutoria);
        return newTutoria;
      }
      throw new Error('No implementado en producción');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tutorias'] }),
  });

  const cancelTutoria = useMutation({
    mutationFn: async (id: string) => {
      if (isDevMode()) {
        const tut = MOCK_TUTORIAS.find((t) => t.id === id);
        if (tut) tut.status = 'cancelada';
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tutorias'] }),
  });

  return {
    tutorias: filtered,
    isLoading: query.isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    createTutoria,
    cancelTutoria,
  };
}
