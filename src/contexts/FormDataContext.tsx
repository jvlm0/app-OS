// src/contexts/FormDataContext.tsx

import type { ProductData } from '@/components/service-form/ReadOnlyProductCard';
import type { ServiceData } from '@/components/service-form/ReadOnlyServiceCard';
import React, { createContext, useContext, useState } from 'react';
import type { Client } from '../types/client.types';
import type { Vehicle } from '../types/vehicle.types';

interface FormDataContextType {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  // Serviços
  services: ServiceData[];
  addService: (service: ServiceData) => void;
  removeService: (id: string) => void;
  clearServices: () => void;
  // Produtos
  products: ProductData[];
  addProduct: (product: ProductData) => void;
  removeProduct: (id: string) => void;
  clearProducts: () => void;
  // Produto pendente (selecionado na busca, aguardando preenchimento do form)
  pendingProduct: { cod_subproduto: number; nome: string } | null;
  setPendingProduct: (p: { cod_subproduto: number; nome: string } | null) => void;
  // Geral
  clearFormData: () => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const FormDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [pendingProduct, setPendingProduct] = useState<{
    cod_subproduto: number;
    nome: string;
  } | null>(null);

  const addService = (service: ServiceData) => setServices(prev => [...prev, service]);
  const removeService = (id: string) => setServices(prev => prev.filter(s => s.id !== id));
  const clearServices = () => setServices([]);

  const addProduct = (product: ProductData) => setProducts(prev => [...prev, product]);
  const removeProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const clearProducts = () => setProducts([]);

  const clearFormData = () => {
    setSelectedClient(null);
    setSelectedVehicle(null);
    setServices([]);
    setProducts([]);
    setPendingProduct(null);
  };

  return (
    <FormDataContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        selectedVehicle,
        setSelectedVehicle,
        services,
        addService,
        removeService,
        clearServices,
        products,
        addProduct,
        removeProduct,
        clearProducts,
        pendingProduct,
        setPendingProduct,
        clearFormData,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within FormDataProvider');
  }
  return context;
};