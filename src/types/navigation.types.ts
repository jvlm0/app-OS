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
  OrderList: undefined;
  Login: undefined;
  OrderDetail: {
    cod_ordem: number;
  };
  ServiceForm: {
    order?: Order;
  } | undefined;
  ClientSearch: undefined;
  CameraScreen: {
    cod_cliente: number;
  };
  ClientForm: undefined;
  VehicleForm: {
    plate?: string;
    cod_cliente: number;
  };
  AddService: undefined;
  AddProduct: undefined;
  ProductSearch: undefined;
  AddProblema: {
    problema?: ProblemaData;
  } | undefined;
};