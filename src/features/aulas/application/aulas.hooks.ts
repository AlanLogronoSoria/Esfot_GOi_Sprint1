import { useQuery } from '@tanstack/react-query';
import { ExpressAulasRepository } from '@/services/express/express-repositories';
import { useExpressAuthStore } from '@/services/express/express-auth.store';
import type { Aula } from '@/services/express/express-types';
import { isDevMode } from '@/core/config/env';
import { MockData } from '@/core/dev/mock-services';

const aulasRepo = new ExpressAulasRepository();

export function useAulas() {
  const token = useExpressAuthStore((s) => s.expressToken);

  return useQuery<Aula[]>({
    queryKey: ['express', 'aulas'],
    queryFn: async () => {
      if (isDevMode()) return MockData.getAulas();
      const res = await aulasRepo.getAulas(token ?? undefined);
      if (res.error) throw new Error(res.error);
      return res.data ?? [];
    },
  });
}

export function useAulaDetail(id: string) {
  const token = useExpressAuthStore((s) => s.expressToken);

  return useQuery<Aula>({
    queryKey: ['express', 'aulas', id],
    queryFn: async () => {
      if (isDevMode()) {
        const aulas = await MockData.getAulas();
        const found = aulas.find((a) => a._id === id);
        if (!found) throw new Error('Aula no encontrada');
        return found;
      }
      const res = await aulasRepo.getAulaById(id, token ?? undefined);
      if (res.error || !res.data) throw new Error(res.error ?? 'Aula no encontrada');
      return res.data;
    },
    enabled: !!id,
  });
}
