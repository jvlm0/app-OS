// services/orderService.ts
// Serviço para gerenciar ordens de serviço

import { ENV } from '@/config/env';
import type { OrderCreate, OrderCreateResult, OrderUpdate, OrderUpdateResult } from '../types/order.types';
import { getAccessToken } from './authService';

const API_BASE_URL = ENV.API_URL;

/**
 * Cadastra uma nova ordem de serviço
 * @param orderData - Dados da ordem de serviço para cadastro
 * @returns Código da ordem cadastrada
 */
export const createOrder = async (orderData: OrderCreate): Promise<OrderCreateResult> => {
  try {

    const token = await getAccessToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Não autenticado',
      };
    }

    const response = await fetch(`${API_BASE_URL}/ordens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

/**
 * Atualiza uma ordem de serviço existente
 * @param orderData - Dados da ordem de serviço para atualização
 * @returns Resultado da atualização
 */
export const updateOrder = async (orderData: OrderUpdate): Promise<OrderUpdateResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ordens`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

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