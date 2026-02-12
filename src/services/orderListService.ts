// services/orderListService.ts
// Serviço para listar ordens de serviço - ATUALIZADO com apiClient

import type { Order, OrderListResult } from '../types/order-list.types';
import { api } from '../utils/apiClient';

/**
 * Busca todas as ordens de serviço
 * @returns Lista de ordens de serviço
 */
export const getOrders = async (): Promise<OrderListResult> => {
  try {
    const response = await api.get('/ordens');

    if (!response.ok) {
      // Se retornar 401, o token pode ter expirado
      // Mas o apiClient já tentou renovar automaticamente
      if (response.status === 401) {
        return {
          success: false,
          error: 'Sessão expirada',
        };
      }

      return {
        success: false,
        error: `Erro ao buscar ordens: ${response.status}`,
      };
    }

    const data: Order[] = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao buscar ordens:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};