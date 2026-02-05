// types/order-list.types.ts
// Tipos e interfaces relacionados à listagem de ordens de serviço

/**
 * Dados do cliente na listagem de ordens
 */
export interface OrderClient {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
  cpfcnpj: string;
}

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
  cliente: OrderClient;
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