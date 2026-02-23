// types/order-list.types.ts
// Tipos e interfaces relacionados à listagem de ordens de serviço

import type { Client } from './client.types';

/**
 * Dados do veículo na listagem de ordens
 */
export interface OrderVehicle {
  cod_veiculo?: number;
  modelo?: string;
  placa?: string;
  ano?: string;
  kmatual?: number;
  cor?: string;
  chassi?: string;
  marca?: string;
}

/**
 * Equipe responsável (usada em serviços e produtos)
 */
export interface EquipeResponsavel {
  cod_equipe: number;
  nome: string;
}

/**
 * Vendedor (usado em serviços e produtos)
 */
export interface VendedorResponse {
  cod_vendedor: number;
  nome: string;
}

/**
 * Serviço retornado na ordem
 */
export interface ServicoResponse {
  cod_servico: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  equipe: EquipeResponsavel;
  vendedores: VendedorResponse[];
}

/**
 * Item de produto retornado na ordem
 */
export interface ItemProdutoResponse {
  cod_itemProduto: number;
  nome: string;
  marca: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  vendedores: VendedorResponse[];
}

/**
 * Interface da ordem de serviço na listagem
 */
export interface Order {
  cod_ordem: number;
  status: string;
  titulo: string;
  descricao: string;
  cliente: Client;
  veiculo: OrderVehicle;
  servicos?: ServicoResponse[];
  produtos?: ItemProdutoResponse[];
}

/**
 * Resultado da busca de ordens
 */
export interface OrderListResult {
  success: boolean;
  data?: Order[];
  error?: string;
}

/**
 * Resultado da busca de uma ordem específica
 */
export interface OrderDetailResult {
  success: boolean;
  data?: Order;
  error?: string;
}