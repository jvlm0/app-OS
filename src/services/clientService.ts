// services/clientService.ts
// Serviço para gerenciar clientes

import { ENV } from '@/config/env';
import type { Client, ClientCreate, ClientCreateResult } from '../types/client.types';
import { getAccessToken } from './authService';

const API_BASE_URL = ENV.API_URL;

/**
 * Cadastra um novo cliente
 * @param clientData - Dados do cliente para cadastro
 * @returns Código do cliente cadastrado
 */
export const createClient = async (clientData: ClientCreate): Promise<ClientCreateResult> => {
  try {

    const token = await getAccessToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Não autenticado',
      };
    }

    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao cadastrar cliente: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};


export interface PaginatedResponse {
  page: number;
  page_size: number;
  total_pages: number;
  data: Client[];
}

export interface FetchClientsParams {
  query: string;
  page: number;
  pageSize?: number;
}

export async function fetchClients({
  query,
  page,
  pageSize = 20,
}: FetchClientsParams): Promise<PaginatedResponse> {

  const token = await getAccessToken();
    
  if (!token) {
    return {
      page: 0,
      page_size: 0,
      total_pages: 0,
      data: []
    };
    }

  const url = `${API_BASE_URL}/clientes?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
     },
    
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar clientes: ${response.status}`);
  }

  return response.json();
}
