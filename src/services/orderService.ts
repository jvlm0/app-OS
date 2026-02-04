// services/orderService.ts
// Serviço para gerenciar ordens de serviço

import type { OrderCreate, OrderCreateResult } from '../types/order.types';

const API_BASE_URL = 'http://100.67.122.72:8000';

/**
 * Cadastra uma nova ordem de serviço
 * @param orderData - Dados da ordem de serviço para cadastro
 * @returns Código da ordem cadastrada
 */
export const createOrder = async (orderData: OrderCreate): Promise<OrderCreateResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ordens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao cadastrar ordem de serviço: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao cadastrar ordem de serviço:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};