// services/orderService.ts
// Serviço para gerenciar ordens de serviço - ATUALIZADO com apiClient

import type { OrderCreate, OrderCreateResult, OrderUpdate, OrderUpdateResult } from '../types/order.types';
import { api } from '../utils/apiClient';

/**
 * Cadastra uma nova ordem de serviço
 * @param orderData - Dados da ordem de serviço para cadastro
 * @returns Código da ordem cadastrada
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

/**
 * Atualiza uma ordem de serviço existente
 * @param orderData - Dados da ordem de serviço para atualização
 * @returns Resultado da atualização
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

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao atualizar ordem de serviço:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};