// utils/apiClient.ts
// Cliente HTTP com renovação automática de token

import { ENV } from '@/config/env';
import * as authService from '../services/authService';

const API_BASE_URL = ENV.API_URL;

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  retry?: boolean;
}

/**
 * Cliente HTTP que automaticamente renova o token em caso de 401
 */
export const apiClient = async (
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const { skipAuth = false, retry = true, ...fetchOptions } = options;

  // Adicionar token de autenticação se não for skipAuth
  if (!skipAuth) {
    const token = await authService.getAccessToken();
    
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  // Adicionar Content-Type padrão se não especificado
  if (!fetchOptions.headers?.['Content-Type']) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  let response = await fetch(url, fetchOptions);

  // Se recebeu 401 (não autorizado) e pode tentar novamente
  if (response.status === 401 && retry && !skipAuth) {
    console.log('Token expirado (401), tentando renovar...');
    
    // Tentar renovar o token
    const refreshResult = await authService.refreshAccessToken();
    
    if (refreshResult.success && refreshResult.data) {
      console.log('Token renovado, repetindo requisição...');
      
      // Atualizar o header com o novo token
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${refreshResult.data.access_token}`,
      };
      
      // Repetir a requisição com o novo token (sem retry para evitar loop)
      response = await fetch(url, { ...fetchOptions });
    } else {
      console.log('Falha ao renovar token');
      // Se falhou ao renovar, retornar a resposta 401 original
      // O app deve redirecionar para login
    }
  }

  return response;
};

/**
 * Métodos auxiliares para facilitar o uso
 */
export const api = {
  get: (endpoint: string, options?: FetchOptions) =>
    apiClient(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint: string, data?: any, options?: FetchOptions) =>
    apiClient(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: (endpoint: string, data?: any, options?: FetchOptions) =>
    apiClient(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: (endpoint: string, options?: FetchOptions) =>
    apiClient(endpoint, { ...options, method: 'DELETE' }),
};