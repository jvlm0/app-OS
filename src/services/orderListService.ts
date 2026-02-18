// services/orderListService.ts
// Serviço para listar ordens de serviço - ATUALIZADO com paginação

import type { Order, OrderListResult } from '../types/order-list.types';
import { api } from '../utils/apiClient';

export interface PaginatedOrdersResponse {
  page: number;
  page_size: number;
  total_pages: number;
  data: Order[];
}

/**
 * Busca ordens de serviço com paginação
 */
export const getOrders = async (
  page: number = 1,
  pageSize: number = 10,
): Promise<OrderListResult & { total_pages?: number }> => {
  try {
    const response = await api.get(`/ordens?page=${page}&page_size=${pageSize}`);

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: 'Sessão expirada' };
      }
      return { success: false, error: `Erro ao buscar ordens: ${response.status}` };
    }

    const json: PaginatedOrdersResponse = await response.json();

    return {
      success: true,
      data: json.data,
      total_pages: json.total_pages,
    };
  } catch (error) {
    console.error('Erro ao buscar ordens:', error);
    return { success: false, error: 'Erro ao conectar com o servidor' };
  }
};