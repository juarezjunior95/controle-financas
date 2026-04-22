const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1';

if (typeof window !== 'undefined') {
  console.log('[API] Backend URL:', BASE_URL);
}

interface FetchOptions extends RequestInit {
  token?: string | null;
}


// Mapeamento de  códigos de erro e status HTTP para mensagens amigáveis
function getFriendlyMessage(code: string, status?: number): string {
  const messages: Record<string, string> = {
    'NETWORK_ERROR': 'Ops! Não conseguimos conectar ao servidor. Verifique sua conexão com a internet.',
    'UNAUTHORIZED': 'Sua sessão expirou ou você não está logado. Por favor, entre novamente.',
    'FORBIDDEN': 'Você não tem permissão para realizar esta ação.',
    'NOT_FOUND': 'Não conseguimos encontrar o que você procurou.',
    'INTERNAL_ERROR': 'Algo deu errado por aqui. Já fomos notificados e estamos trabalhando para resolver!',
    'SERVICE_UNAVAILABLE': 'Nosso sistema está passando por uma manutenção rápida. Tente novamente em instantes.',
    'BAD_REQUEST': 'Algumas informações parecem estar incorretas. Verifique os dados digitados.',
    'VALIDATION_ERROR': 'Verifique as informações preenchidas e tente novamente.',
    'AUTH_FAILED': 'E-mail ou senha incorretos. Por favor, verifique as suas credenciais.',
  };

  // Prioriza mensagens baseadas em status HTTP comuns
  if (status === 401) return messages['UNAUTHORIZED'];
  if (status === 403) return messages['FORBIDDEN'];
  if (status === 404) return messages['NOT_FOUND'];
  if (status === 400 || status === 422) return messages['BAD_REQUEST'];
  if (status && status >= 500) return messages['INTERNAL_ERROR'];

  return messages[code] || 'Ocorreu um erro inesperado. Por favor, tente novamente.';
}

/**
 * Helper para chamadas à API do backend.
 * Injeta automaticamente o token de autenticação quando disponível.
 */
export async function fetchAPI<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data?: T; error?: { code: string; message: string; originalMessage?: string } }> {
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

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const code = json.error?.code || 'API_ERROR';
      return {
        error: {
          code,
          message: getFriendlyMessage(code, res.status),
          originalMessage: json.error?.message || res.statusText,
        },
      };
    }

    return { data: json.data };
  } catch (error) {
    console.error('[fetchAPI] Falha na requisição:', error);
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: getFriendlyMessage('NETWORK_ERROR'),
      },
    };
  }
}
