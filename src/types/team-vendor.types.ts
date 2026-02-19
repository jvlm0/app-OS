// types/team-vendor.types.ts

export interface Vendedor {
  cod_vendedor: number;
  nome: string;
}

export interface Equipe {
  cod_equipe: number;
  nome: string;
}

export interface VendedoresResult {
  success: boolean;
  data?: Vendedor[];
  error?: string;
}

export interface EquipesResult {
  success: boolean;
  data?: Equipe[];
  error?: string;
}