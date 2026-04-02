const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1';

if (typeof window !== 'undefined') {
  console.log('[API] Backend URL:', BASE_URL);
}

interface FetchOptions extends RequestInit {
  token?: string | null;
}

/**
 * Helper para chamadas à API do backend.
 * Injeta automaticamente o token de autenticação quando disponível.
 */
export async function fetchAPI<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data?: T; error?: { code: string; message: string } }> {
  const { token, headers: customHeaders, ...restOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  // Injeta o token Bearer se disponível
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...restOptions,
      headers,
      cache: 'no-store',
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        error: json.error || {
          code: 'API_ERROR',
          message: `Erro ${res.status}: ${res.statusText}`,
        },
      };
    }

    return { data: json.data };
  } catch (error) {
    console.error('[fetchAPI] Falha na requisição:', error);
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: 'Não foi possível conectar ao servidor.',
      },
    };
  }
}
