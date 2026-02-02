// services/vehicleService.ts
// Serviço para consultar dados de veículos por placa

import type { VehicleData, VehicleQueryResult } from '../types/vehicle.types';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Consulta dados do veículo pela placa
 * @param plate - Placa do veículo (com ou sem hífen)
 * @returns Dados do veículo se encontrado
 */
export const getVehicleByPlate = async (plate: string): Promise<VehicleQueryResult> => {
  try {
    // Remove caracteres especiais da placa para enviar na URL
    const cleanPlate = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    const response = await fetch(`${API_BASE_URL}/veiculos/${cleanPlate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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

    const data: VehicleData = await response.json();

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