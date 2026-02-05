import type { Order } from './order-list.types';
import type { Vehicle } from './vehicle.types';

export interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
}


export type RootStackParamList = {
  OrderList: undefined;

  ServiceForm: {
    order?: Order;
  } | undefined;

  ClientSearch: {
    onSelectClient: (client: Client) => void;
  };

  CameraScreen: {
    cod_cliente: number;
    onVehicleAdd: (vehicle: Vehicle) => void;
  };

  ClientForm: {
    onClientAdd: (client: Client) => void;
  };

  VehicleForm: {
    plate?: string;
    cod_cliente: number;
    onVehicleAdd: (vehicle: Vehicle) => void;
  };
};