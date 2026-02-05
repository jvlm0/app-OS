// types/order-list.types.ts
// Tipos e interfaces relacionados à listagem de ordens de serviço

import type { Client } from './client.types';

/**
 * Dados do veículo na listagem de ordens
 */
export interface OrderVehicle {
  cod_veiculo: number;
  modelo: string;
  placa: string;
  ano: string;
  kmatual: number;
}

/**
 * Interface da ordem de serviço na listagem
 */
export interface Order {
  cod_ordem: number;
  status: string;
  titulo: string;
  descricao: string;
  cliente: Client; // Usando o tipo unificado Client
  veiculo: OrderVehicle;
}

/**
 * Resultado da busca de ordens
 */
export interface OrderListResult {
  success: boolean;
  data?: Order[];
  error?: string;
}