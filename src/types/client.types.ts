// types/client.types.ts

export type PersonType = 'PF' | 'PJ';

export interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
  cpfcnpj?: string;
  /** Tipo de pessoa — pode não vir da listagem, mas vem do detalhe */
  tipoPessoa?: PersonType;
}

export interface ClientCreate {
  tipoPessoa: string;
  nome: string;
  telefone: string;
  cpfcnpj: string;
}

export interface ClientCreateResponse {
  status: string;
  cod_pessoa: number;
}

export interface ClientCreateResult {
  success: boolean;
  data?: ClientCreateResponse;
  error?: string;
}

export interface ClientUpdateResult {
  success: boolean;
  data?: ClientCreateResponse;
  error?: string;
}
