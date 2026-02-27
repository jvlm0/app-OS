import type { Client } from './client.types';
import type { ProblemaOrdem } from './order.types';

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

export interface EquipeResponsavel {
  cod_equipe: number;
  nome: string;
}

export interface VendedorResponse {
  cod_vendedor: number;
  nome: string;
}

export interface ServicoResponse {
  cod_servico: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  equipe: EquipeResponsavel;
  vendedores: VendedorResponse[];
}

export interface ItemProdutoResponse {
  cod_itemProduto: number;
  nome: string;
  marca: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  vendedores: VendedorResponse[];
}

export interface Order {
  cod_ordem: number;
  status: string;
  titulo: string;
  descricao: string;
  cliente: Client;
  veiculo: OrderVehicle;
  servicos?: ServicoResponse[];
  produtos?: ItemProdutoResponse[];
  problemas?: ProblemaOrdem[]; // NOVO
}

export interface OrderListResult {
  success: boolean;
  data?: Order[];
  error?: string;
}

export interface OrderDetailResult {
  success: boolean;
  data?: Order;
  error?: string;
}