import type { Order } from './order-list.types';
import type { Vehicle } from './vehicle.types';

export interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
}

// Eventos personalizados para comunicação entre telas
export type NavigationEvents = {
  clientSelected: { client: Client };
  clientAdded: { client: Client };
  vehicleAdded: { vehicle: Vehicle };
};

export type RootStackParamList = {
  OrderList: undefined;

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
};