// utils/apiClient.ts - VERSÃO ROBUSTA
// Cliente HTTP com proteção contra erros e renovação automática de token

import { ENV } from '@/config/env';
import * as authService from '../services/authService';

const API_BASE_URL = ENV.API_URL;

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  retry?: boolean;
  timeout?: number;
}

/**
 * Valida e constrói URL completa
 */
const buildUrl = (endpoint: string): string => {
  endpoint = endpoint.trim();
  
  if (!endpoint.startsWith('/') && !endpoint.startsWith('http')) {
    endpoint = '/' + endpoint;
  }
  
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint}`;
  
  // Validar URL
  try {
    new URL(url);
    return url;
  } catch (error) {
    console.error('[API] URL inválida:', endpoint);
    throw new Error(`URL inválida: ${endpoint}`);
  }
};

/**
 * Constrói headers sanitizados
 */
const buildHeaders = async (
  skipAuth: boolean, 
  customHeaders?: HeadersInit
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Adicionar token de autenticação
  if (!skipAuth) {
    const token = await authService.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Mesclar headers customizados (removendo valores inválidos)
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      if (value !== undefined && value !== null && typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  return headers;
};

/**
 * Cliente HTTP que automaticamente renova o token em caso de 401
 */
export const apiClient = async (
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const { 
    skipAuth = false, 
    retry = true, 
    timeout = 30000, // 30 segundos
    ...fetchOptions 
  } = options;

  // Construir URL
  const url = buildUrl(endpoint);
  
  // Construir headers
  fetchOptions.headers = await buildHeaders(skipAuth, fetchOptions.headers);

  // Adicionar timeout via AbortController
  const controller = new AbortController();
  fetchOptions.signal = controller.signal;
  
  const timeoutId = setTimeout(() => {
    console.log(`[API] ⏱️  Timeout após ${timeout}ms: ${endpoint}`);
    controller.abort();
  }, timeout);

  try {
    const startTime = Date.now();
    const method = fetchOptions.method || 'GET';
    console.log(`[API] → ${method} ${endpoint}`);

    // Fazer requisição
    let response = await fetch(url, fetchOptions);
    
    // Limpar timeout
    clearTimeout(timeoutId);
    
    const duration = Date.now() - startTime;
    const statusEmoji = response.ok ? '✓' : '✗';
    console.log(`[API] ${statusEmoji} ${response.status} ${endpoint} (${duration}ms)`);

    // Se recebeu 401 (não autorizado) e pode tentar renovar
    if (response.status === 401 && retry && !skipAuth) {
      console.log('[API] 🔄 Token expirado (401), tentando renovar...');
      
      const refreshResult = await authService.refreshAccessToken();
      
      if (refreshResult.success && refreshResult.data) {
        console.log('[API] ✓ Token renovado, repetindo requisição...');
        
        // Repetir requisição com novo token (sem retry para evitar loop)
        response = await apiClient(endpoint, { ...options, retry: false });
      } else {
        console.log('[API] ✗ Falha ao renovar token');
      }
    }

    return response;

  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Se foi cancelado por timeout
    if (error.name === 'AbortError') {
      console.error(`[API] ⏱️  Timeout: ${endpoint}`);
      throw new Error('Tempo de requisição esgotado. Verifique sua conexão.');
    }
    
    // Se foi cancelado pelo usuário/navegação
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      console.warn(`[API] ⚠️  Requisição cancelada: ${endpoint}`);
      throw error;
    }
    
    // Erro de rede
    if (error.message?.includes('Network request failed')) {
      console.error(`[API] 🌐 Erro de rede: ${endpoint}`);
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
    
    console.error(`[API] ✗ Erro: ${endpoint}`, error.message);
    throw error;
  }
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
  
  put: (endpoint: string, data?: any, options?: FetchOptions) =>
    apiClient(endpoint, {
      ...options,
      method: 'PUT',
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