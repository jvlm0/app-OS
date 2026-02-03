// types/client.types.ts
// Tipos e interfaces relacionados a clientes

/**
 * Tipo de pessoa
 */
export type PersonType = 'PF' | 'PJ';

/**
 * Interface do cliente
 */
export interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
  cpfcnpj?: string;
}

/**
 * Dados para criar um cliente na API
 */
export interface ClientCreate {
  nome: string;
  telefone: string;
  cpfcnpj: string;
}

/**
 * Resposta da API ao criar cliente
 */
export interface ClientCreateResponse {
  status: string;
  cod_pessoa: number;
}

/**
 * Resultado da criação de cliente
 */
export interface ClientCreateResult {
  success: boolean;
  data?: ClientCreateResponse;
  error?: string;
}