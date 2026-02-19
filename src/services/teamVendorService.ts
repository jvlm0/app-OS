// services/teamVendorService.ts

import type { EquipesResult, VendedoresResult } from '@/types/team-vendor.types';
import { api } from '../utils/apiClient';

/**
 * Busca todos os vendedores cadastrados
 * @returns Lista de vendedores
 */
export const fetchVendedores = async (): Promise<VendedoresResult> => {
  try {
    const response = await api.get('/vendedores');

    if (!response.ok) {
      return {
        success: false,
        error: `Erro ao buscar vendedores: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

/**
 * Busca todas as equipes cadastradas
 * @returns Lista de equipes
 */
export const fetchEquipes = async (): Promise<EquipesResult> => {
  try {
    const response = await api.get('/equipes');

    if (!response.ok) {
      return {
        success: false,
        error: `Erro ao buscar equipes: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao buscar equipes:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};