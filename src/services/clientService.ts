// services/clientService.ts
// Serviço para gerenciar clientes - ATUALIZADO com apiClient

import type { Client, ClientCreate, ClientCreateResult } from '../types/client.types';
import { api } from '../utils/apiClient';

/**
 * Cadastra um novo cliente
 * @param clientData - Dados do cliente para cadastro
 * @returns Código do cliente cadastrado
 */
export const createClient = async (clientData: ClientCreate): Promise<ClientCreateResult> => {
  try {
    const response = await api.post('/clientes', clientData);

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
  try {
    const url = `/clientes?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`;
    const response = await api.get(url);

    if (!response.ok) {
      throw new Error(`Erro ao buscar clientes: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return {
      page: 0,
      page_size: 0,
      total_pages: 0,
      data: []
    };
  }
}