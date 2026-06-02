const BASE_URL = 'http://localhost:3000/api';

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: unknown;
  token?: string | null;
  formData?: FormData;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${config.path}`;
    const headers: Record<string, string> = {};

    if (!config.formData) {
      headers['Content-Type'] = 'application/json';
    }

    if (config.token) {
      headers['Authorization'] = `Bearer ${config.token}`;
    }

    try {
      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.formData ?? (config.body ? JSON.stringify(config.body) : undefined),
      });

      const contentType = response.headers.get('content-type');
      let data: T | null = null;

      if (contentType?.includes('application/json')) {
        data = (await response.json()) as T;
      }

      if (!response.ok) {
        const errorMsg =
          (data as Record<string, unknown>)?.msg as string ??
          (data as Record<string, unknown>)?.message as string ??
          `Error ${response.status}`;
        return { data: null, error: errorMsg, status: response.status };
      }

      return { data, error: null, status: response.status };
    } catch (error) {
      const message =
        error instanceof TypeError && error.message === 'Network request failed'
          ? 'Error de conexión. Verifica tu internet.'
          : 'Error inesperado al comunicarse con el servidor.';

      return { data: null, error: message, status: 0 };
    }
  }

  get<T>(path: string, token?: string | null): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', path, token });
  }

  post<T>(path: string, body?: unknown, token?: string | null): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', path, body, token });
  }

  put<T>(path: string, body?: unknown, token?: string | null): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', path, body, token });
  }

  delete<T>(path: string, token?: string | null): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', path, token });
  }

  upload<T>(path: string, formData: FormData, token?: string | null): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', path, formData, token });
  }
}

export const expressClient = new ApiClient();
