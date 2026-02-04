// types/order.types.ts
// Tipos e interfaces relacionados a ordens de serviço

/**
 * Dados para criar uma ordem de serviço na API
 */
export interface OrderCreate {
  titulo: string;
  descricao: string;
  cod_veiculo: number;
  cod_cliente: number;
}

/**
 * Resposta da API ao criar ordem de serviço
 */
export interface OrderCreateResponse {
  status: string;
  cod_ordem: number;
}

/**
 * Resultado da criação de ordem de serviço
 */
export interface OrderCreateResult {
  success: boolean;
  data?: OrderCreateResponse;
  error?: string;
}