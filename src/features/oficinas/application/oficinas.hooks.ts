import { useQuery } from '@tanstack/react-query';
import { ExpressOficinasRepository } from '@/services/express/express-repositories';
import { useExpressAuthStore } from '@/services/express/express-auth.store';
import type { Oficina } from '@/services/express/express-types';
import { isDevMode } from '@/core/config/env';
import { MockData } from '@/core/dev/mock-services';

const oficinasRepo = new ExpressOficinasRepository();

export function useOficinas() {
  const token = useExpressAuthStore((s) => s.expressToken);

  return useQuery<Oficina[]>({
    queryKey: ['express', 'oficinas'],
    queryFn: async () => {
      if (isDevMode()) return MockData.getOficinas();
      const res = await oficinasRepo.getOficinas(token ?? undefined);
      if (res.error) throw new Error(res.error);
      return res.data ?? [];
    },
  });
}

export function useOficinaDetail(id: string) {
  const token = useExpressAuthStore((s) => s.expressToken);

  return useQuery<Oficina>({
    queryKey: ['express', 'oficinas', id],
    queryFn: async () => {
      if (isDevMode()) {
        const oficinas = await MockData.getOficinas();
        const found = oficinas.find((o) => o._id === id);
        if (!found) throw new Error('Oficina no encontrada');
        return found;
      }
      const res = await oficinasRepo.getOficinaById(id, token ?? undefined);
      if (res.error || !res.data) throw new Error(res.error ?? 'Oficina no encontrada');
      return res.data;
    },
    enabled: !!id,
  });
}
