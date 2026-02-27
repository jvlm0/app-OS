// types/order.types.ts
// Tipos e interfaces relacionados a ordens de serviço

import type { Order } from './order-list.types';

/**
 * Dados de um serviço para envio na criação/atualização da ordem
 */
export interface ServicoCreate {
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  cod_equipe: number;
  cods_vendedores: number[];
}

/**
 * Dados de um produto para envio na criação/atualização da ordem
 */
export interface ItemProdutoCreate {
  cod_subproduto: number;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  cods_vendedores: number[];
}

/**
 * Dados para criar uma ordem de serviço na API
 */
export interface OrderCreate {
  titulo: string;
  descricao: string;
  cod_veiculo: number;
  cod_cliente: number;
  servicos?: ServicoCreate[];
  produtos?: ItemProdutoCreate[];
  problemas?: ProblemaOrdem[]; // NOVO
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

/**
 * Dados para atualizar uma ordem de serviço na API
 */
export interface OrderUpdate {
  cod_ordem: number;
  titulo?: string;
  descricao?: string;
  cod_veiculo?: number;
  cod_cliente?: number;
  servicos?: ServicoCreate[];
  produtos?: ItemProdutoCreate[];
  servicosRemovidos?: number[];
  produtosRemovidos?: number[];
  problemas?: ProblemaOrdem[];
}

/**
 * Resultado da atualização de ordem de serviço.
 * A API retorna a ordem completa atualizada (mesmo shape de GET /ordens/{id}).
 */
export interface OrderUpdateResult {
  success: boolean;
  data?: Order;
  error?: string;
}


export interface ProblemaOrdem {
  descricao: string;
  solucao?: string;
}