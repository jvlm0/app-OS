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

export interface DeleteOrderSuccessResponse {
  status: 'sucesso';
  cod_ordem: number;
}

export interface DeleteOrderNeedsConfirmationResponse {
  quantidade: number;
  cod_ordem: number;
}

export interface DeleteOrderResult {
  success: boolean;
  data?: DeleteOrderSuccessResponse | DeleteOrderNeedsConfirmationResponse;
  error?: string;
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

/**
 * Remove uma ordem de serviço.
 *
 * Na primeira tentativa, enviar trust = 'n'.
 * Se a API retornar `quantidade`, a tela deve pedir confirmação
 * e repetir a exclusão com trust = 'y'.
 */
export const deleteOrder = async (
  cod_ordem: number,
  trust: 'y' | 'n',
): Promise<DeleteOrderResult> => {
  try {
    const response = await api.delete(`/ordens/${cod_ordem}?trust=${trust}`);

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: 'Sessão expirada' };
      }

      return {
        success: false,
        error: `Erro ao excluir ordem: ${response.status}`,
      };
    }

    const json = await response.json();

    return {
      success: true,
      data: json,
    };
  } catch (error) {
    console.error('Erro ao excluir ordem:', error);
    return { success: false, error: 'Erro ao conectar com o servidor' };
  }
};
