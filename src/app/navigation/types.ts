export interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
}

export interface Vehicle {
  plate: string;
  mileage: string;
}

export type RootStackParamList = {
  ServiceForm: undefined;

  ClientSearch: {
    onSelectClient: (client: Client) => void;
  };

  CameraScreen: {
    onVehicleAdd: (vehicle: Vehicle) => void;
  };

  VehicleForm: {
    plate?: string;
    onVehicleAdd: (vehicle: Vehicle) => void;
  };
};
