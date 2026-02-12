// services/vehicleService.ts
// Serviço para consultar dados de veículos por placa - ATUALIZADO com apiClient

import type { VehicleCreate, VehicleCreateResult, VehicleQueryResult, VehicleUpdate, VehicleUpdateResult } from '../types/vehicle.types';
import { api } from '../utils/apiClient';

/**
 * Consulta dados do veículo pela placa
 * @param plate - Placa do veículo (com ou sem hífen)
 * @returns Dados do veículo se encontrado
 */
export const getVehicleByPlate = async (plate: string): Promise<VehicleQueryResult> => {
  try {
    // Remove caracteres especiais da placa para enviar na URL
    const cleanPlate = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    const response = await api.get(`/veiculos/${cleanPlate}`);

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
    const response = await api.post('/veiculos', vehicleData);

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
    const response = await api.patch('/veiculos', vehicleData);

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