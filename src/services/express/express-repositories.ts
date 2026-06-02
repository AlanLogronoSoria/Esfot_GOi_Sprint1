import { expressClient, ApiResponse } from './api-client';
import type {
  ExpressLoginInput,
  ExpressLoginResult,
  ExpressRegisterInput,
  ExpressUser,
  Aula,
  Oficina,
  ExpressEvento,
} from './express-types';

export class ExpressAuthRepository {
  async loginEstudiante(input: ExpressLoginInput): Promise<ApiResponse<ExpressLoginResult>> {
    return expressClient.post<ExpressLoginResult>('/estudiantes/login', input);
  }

  async loginAdmin(input: ExpressLoginInput): Promise<ApiResponse<ExpressLoginResult>> {
    return expressClient.post<ExpressLoginResult>('/admin/login', input);
  }

  async registerEstudiante(input: ExpressRegisterInput): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.post<{ msg: string }>('/estudiantes/registro', {
      ...input,
      nombre: input.nombre ?? '',
    });
  }

  async getProfile(token: string): Promise<ApiResponse<ExpressUser>> {
    return expressClient.get<ExpressUser>('/perfil', token);
  }

  async updateProfile(
    id: string,
    data: Partial<ExpressUser>,
    token: string
  ): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.put<{ msg: string }>(`/actualizarperfil/${id}`, data, token);
  }

  async updatePassword(
    id: string,
    passwordactual: string,
    passwordnuevo: string,
    token: string
  ): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.put<{ msg: string }>(
      `/actualizarpassword/${id}`,
      { passwordactual, passwordnuevo },
      token
    );
  }

  async recoverPassword(email: string): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.post<{ msg: string }>('/recuperarpassword', { email });
  }
}

export class ExpressAulasRepository {
  async getAulas(token?: string): Promise<ApiResponse<Aula[]>> {
    return expressClient.get<Aula[]>('/aulas', token);
  }

  async getAulaById(id: string, token?: string): Promise<ApiResponse<Aula>> {
    return expressClient.get<Aula>(`/veraula/${id}`, token);
  }
}

export class ExpressAdminAulasRepository {
  async createAula(data: Partial<Aula>, token: string): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.post<{ msg: string }>('/admin/aula', data, token);
  }

  async updateAula(id: string, data: Partial<Aula>, token: string): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.put<{ msg: string }>(`/admin/actualizaraula/${id}`, data, token);
  }

  async deleteAula(id: string, token: string): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.delete<{ msg: string }>(`/admin/eliminaraula/${id}`, token);
  }
}

export class ExpressOficinasRepository {
  async getOficinas(token?: string): Promise<ApiResponse<Oficina[]>> {
    return expressClient.get<Oficina[]>('/oficinas', token);
  }

  async getOficinaById(id: string, token?: string): Promise<ApiResponse<Oficina>> {
    return expressClient.get<Oficina>(`/veroficina/${id}`, token);
  }
}

export class ExpressAdminOficinasRepository {
  async createOficina(data: Partial<Oficina>, token: string): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.post<{ msg: string }>('/admin/oficina', data, token);
  }

  async updateOficina(id: string, data: Partial<Oficina>, token: string): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.put<{ msg: string }>(`/admin/actualizaroficina/${id}`, data, token);
  }

  async deleteOficina(id: string, token: string): Promise<ApiResponse<{ msg: string }>> {
    return expressClient.delete<{ msg: string }>(`/admin/eliminaroficina/${id}`, token);
  }
}

export class ExpressEventosRepository {
  async getEventos(): Promise<ApiResponse<ExpressEvento[]>> {
    return expressClient.get<ExpressEvento[]>('/eventos');
  }

  async getEventoById(id: string): Promise<ApiResponse<ExpressEvento>> {
    return expressClient.get<ExpressEvento>(`/verevento/${id}`);
  }
}
