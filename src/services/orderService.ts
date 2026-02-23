// services/orderService.ts

import type {
  OrderCreate,
  OrderCreateResult,
  OrderUpdate,
  OrderUpdateResult,
} from '../types/order.types';
import { api } from '../utils/apiClient';

/**
 * Cadastra uma nova ordem de serviço
 */
export const createOrder = async (orderData: OrderCreate): Promise<OrderCreateResult> => {
  try {
    const response = await api.post('/ordens', orderData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao cadastrar ordem de serviço: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao cadastrar ordem de serviço:', error);
    return { success: false, error: 'Erro ao conectar com o servidor' };
  }
};

/**
 * Atualiza uma ordem de serviço existente.
 * Envia apenas os campos que foram alterados:
 * - servicos: novos serviços a adicionar
 * - produtos: novos produtos a adicionar
 * - servicosRemovidos: IDs de serviços a remover
 * - produtosRemovidos: IDs de produtos a remover
 */
export const updateOrder = async (orderData: OrderUpdate): Promise<OrderUpdateResult> => {
  try {
    const response = await api.patch('/ordens', orderData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao atualizar ordem de serviço: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao atualizar ordem de serviço:', error);
    return { success: false, error: 'Erro ao conectar com o servidor' };
  }
};