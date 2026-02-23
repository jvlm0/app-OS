// services/orderDetailService.ts
// Serviço para buscar detalhes de uma ordem de serviço específica

import type { OrderDetailResult } from '../types/order-list.types';
import { api } from '../utils/apiClient';

/**
 * Busca os detalhes completos de uma ordem de serviço, incluindo serviços e produtos
 * @param cod_ordem - Código da ordem de serviço
 */
export const getOrderDetail = async (cod_ordem: number): Promise<OrderDetailResult> => {
  try {
    const response = await api.get(`/ordens/${cod_ordem}`);

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: 'Sessão expirada' };
      }
      if (response.status === 404) {
        return { success: false, error: 'Ordem de serviço não encontrada' };
      }
      return { success: false, error: `Erro ao buscar ordem: ${response.status}` };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes da ordem:', error);
    return { success: false, error: 'Erro ao conectar com o servidor' };
  }
};