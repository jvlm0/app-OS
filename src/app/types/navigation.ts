// types/navigation.ts
// Arquivo com os tipos compartilhados de navegação

export interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
}

export type RootStackParamList = {
  ServiceForm: undefined;
  ClientSearch: {
    onSelectClient: (client: Client) => void;
  };
};