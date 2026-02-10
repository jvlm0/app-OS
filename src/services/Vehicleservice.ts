// services/vehicleService.ts
// Serviço para consultar dados de veículos por placa

import { ENV } from '@/config/env';
import type { VehicleCreate, VehicleCreateResult, VehicleQueryResult, VehicleUpdate, VehicleUpdateResult } from '../types/vehicle.types';
import { getAccessToken } from './authService';

const API_BASE_URL = ENV.API_URL;

/**
 * Consulta dados do veículo pela placa
 * @param plate - Placa do veículo (com ou sem hífen)
 * @returns Dados do veículo se encontrado
 */
export const getVehicleByPlate = async (plate: string): Promise<VehicleQueryResult> => {
  try {

    const token = await getAccessToken();
        
    if (!token) {
      return {
        success: false,
        error: 'Não autenticado',
      };
    }


    // Remove caracteres especiais da placa para enviar na URL
    const cleanPlate = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    const response = await fetch(`${API_BASE_URL}/veiculos/${cleanPlate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Veículo não encontrado na base de dados',
        };
      }
      
      return {
        success: false,
        error: `Erro ao consultar veículo: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao consultar veículo:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

/**
 * Cadastra um novo veículo
 * @param vehicleData - Dados do veículo para cadastro
 * @returns Código do veículo cadastrado
 */
export const createVehicle = async (vehicleData: VehicleCreate): Promise<VehicleCreateResult> => {
  try {

    const token = await getAccessToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Não autenticado',
      };
    }

    const response = await fetch(`${API_BASE_URL}/veiculos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao cadastrar veículo: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao cadastrar veículo:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

/**
 * Atualiza dados de um veículo existente
 * @param vehicleData - Dados do veículo para atualização
 * @returns Status da atualização
 */
export const updateVehicle = async (vehicleData: VehicleUpdate): Promise<VehicleUpdateResult> => {
  try {
    
    const token = await getAccessToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Não autenticado',
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/veiculos`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao atualizar veículo: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};