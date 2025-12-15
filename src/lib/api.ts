/**
 * Utilidades para llamadas a la API
 */

/**
 * Obtiene la URL base de la API
 * En desarrollo: http://localhost:3000/api
 * En producción: https://corazondemariaarequipa.com/api
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  // Remover barra inicial del endpoint si existe
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Si baseUrl termina con /api y endpoint también lo incluye, evitar duplicación
  if (baseUrl.endsWith('/api') && cleanEndpoint.startsWith('api/')) {
    return `${baseUrl.slice(0, -4)}/${cleanEndpoint}`;
  }
  
  return `${baseUrl}/${cleanEndpoint}`;
}

/**
 * Realiza una petición GET a la API
 */
export async function apiGet<T = any>(endpoint: string): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Realiza una petición POST a la API
 */
export async function apiPost<T = any>(endpoint: string, data: any): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}
