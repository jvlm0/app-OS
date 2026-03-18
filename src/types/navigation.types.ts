// src/types/navigation.types.ts

import { Order } from './order-list.types';
import type { ProblemaData } from './problema.types';
import type { Vehicle } from './vehicle.types';

export interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
}

export type NavigationEvents = {
  clientSelected: { client: Client };
  clientAdded: { client: Client };
  vehicleAdded: { vehicle: Vehicle };
};

export type RootStackParamList = {
  Home: undefined;
  OrderList: undefined;
  Login: undefined;
  OrderDetail: {
    cod_ordem: number;
  };
  ServiceForm: {
    order?: Order;
  } | undefined;
  /**
   * mode: 'select' → comportamento padrão (seleciona e volta)
   * mode: 'view'   → ao selecionar o cliente abre ClientForm em vez de voltar
   */
  ClientSearch: { mode?: 'select' | 'view'; updatedClient?: import('./client.types').Client } | undefined;
  CameraScreen: {
    cod_cliente: number;
  };
  ClientForm: { client?: import('./client.types').Client } | undefined;
  VehicleForm: {
    plate?: string;
    cod_cliente: number;
  };
  AddService: undefined;
  AddProduct: undefined;
  ProductSearch: { mode?: 'select' | 'view' } | undefined;
  AddProblema: {
    problema?: ProblemaData;
  } | undefined;
};
