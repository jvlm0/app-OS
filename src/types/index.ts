// types/index.ts
// Arquivo central de exportação de tipos

// Tipos de veículos
export type {
    Vehicle, VehicleCreate,
    VehicleCreateResponse,
    VehicleCreateResult, VehicleData,
    VehicleQueryResult
} from './vehicle.types';

// Tipos de clientes
export type {
    Client,
    ClientCreate,
    ClientCreateResponse,
    ClientCreateResult, PersonType
} from './client.types';


// Tipos de ordem de serviço
export type {
    OrderCreate,
    OrderCreateResponse,
    OrderCreateResult
} from './order.types';

// Tipos de listagem de ordens
export type {
    Order,
    OrderClient, OrderListResult, OrderVehicle
} from './order-list.types';

// Tipos de navegação
export type {
    RootStackParamList
} from './navigation.types';
