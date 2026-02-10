// services/clientService.ts
// Serviço para gerenciar clientes

import type { ClientCreate, ClientCreateResult } from '../types/client.types';
import { getAccessToken } from './authService';

const API_BASE_URL = 'http://100.67.122.72:8000';

/**
 * Cadastra um novo cliente
 * @param clientData - Dados do cliente para cadastro
 * @returns Código do cliente cadastrado
 */
export const createClient = async (clientData: ClientCreate): Promise<ClientCreateResult> => {
  try {

    const token = await getAccessToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Não autenticado',
      };
    }

    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao cadastrar cliente: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};