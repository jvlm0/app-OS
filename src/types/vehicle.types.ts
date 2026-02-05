// types/vehicle.types.ts
// Tipos e interfaces relacionados a veículos

/**
 * Interface principal do veículo (unificada - usada em todo o app)
 */
export interface Vehicle {
  cod_veiculo?: number; // ID do veículo (vem do cadastro)
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

/**
 * Dados para criar um veículo na API
 */
export interface VehicleCreate {
  placa: string;
  cod_cliente: number;
  modelo: string;
  ano: string;
  kmatual: number;
}

/**
 * Resposta da API ao criar veículo
 */
export interface VehicleCreateResponse {
  status: string;
  cod_veiculo: number;
}

/**
 * Resultado da criação de veículo
 */
export interface VehicleCreateResult {
  success: boolean;
  data?: VehicleCreateResponse;
  error?: string;
}

/**
 * Dados para atualizar um veículo na API
 */
export interface VehicleUpdate {
  cod_veiculo: number;
  modelo?: string;
  ano?: string;
  kmatual?: number;
}

/**
 * Resposta da API ao atualizar veículo
 */
export interface VehicleUpdateResponse {
  status: string;
}

/**
 * Resultado da atualização de veículo
 */
export interface VehicleUpdateResult {
  success: boolean;
  data?: VehicleUpdateResponse;
  error?: string;
}