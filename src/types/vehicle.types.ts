// types/vehicle.types.ts
// Tipos e interfaces relacionados a veículos

/**
 * Interface principal do veículo usado no formulário e cadastro
 */
export interface Vehicle {
  plate: string;
  modelo: string;
  ano: string;
  mileage: string;
}

/**
 * Dados retornados pela API de consulta de veículos
 */
export interface VehicleData {
  cod_veiculo: number;
  placa: string;
  modelo: string;
  ano: string;
}

/**
 * Resultado da consulta de veículo
 */
export interface VehicleQueryResult {
  success: boolean;
  data?: VehicleData;
  error?: string;
}