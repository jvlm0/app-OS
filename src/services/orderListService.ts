// services/orderListService.ts
// Serviço para listar ordens de serviço

import { ENV } from '@/config/env';
import type { Order, OrderListResult } from '../types/order-list.types';
import { getAccessToken } from './authService';

const API_BASE_URL = ENV.API_URL;

/**
 * Busca todas as ordens de serviço
 * @returns Lista de ordens de serviço
 */
export const getOrders = async (): Promise<OrderListResult> => {
  try {
    const token = await getAccessToken();

    if (!token) {
      return {
        success: false,
        error: 'Não autenticado',
      };
    }

    const response = await fetch(`${API_BASE_URL}/ordens`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Se retornar 401, o token pode ter expirado
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