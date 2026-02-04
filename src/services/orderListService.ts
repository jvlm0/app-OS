// services/orderListService.ts
// Serviço para listar ordens de serviço

import type { Order, OrderListResult } from '../types/order-list.types';

const API_BASE_URL = 'http://100.67.122.72:8000';

/**
 * Busca todas as ordens de serviço
 * @returns Lista de ordens de serviço
 */
export const getOrders = async (): Promise<OrderListResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ordens`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
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