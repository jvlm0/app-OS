// services/clientService.ts

import type { Client, ClientCreate, ClientCreateResult, ClientUpdateResult } from '../types/client.types';
import { api } from '../utils/apiClient';

/**
 * Cadastra um novo cliente
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
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    return { success: false, error: 'Erro ao conectar com o servidor' };
  }
};

/**
 * Atualiza um cliente existente (PUT /clientes/{cod_pessoa})
 */
export const updateClient = async (
  cod_pessoa: number,
  clientData: ClientCreate,
): Promise<ClientUpdateResult> => {
  try {
    const response = await api.put(`/clientes/${cod_pessoa}`, clientData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao atualizar cliente: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return { success: false, error: 'Erro ao conectar com o servidor' };
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
    return { page: 0, page_size: 0, total_pages: 0, data: [] };
  }
}
