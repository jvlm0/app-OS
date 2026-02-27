// src/contexts/FormDataContext.tsx

import type { ProductData } from '@/components/service-form/ReadOnlyProductCard';
import type { ServiceData } from '@/components/service-form/ReadOnlyServiceCard';
import type { ProblemaData } from '@/types/problema.types';
import React, { createContext, useContext, useState } from 'react';
import type { Client } from '../types/client.types';
import type { Order } from '../types/order-list.types';
import type { Vehicle } from '../types/vehicle.types';


interface FormDataContextType {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  // Serviços
  services: ServiceData[];
  setServices: (services: ServiceData[]) => void;
  addService: (service: ServiceData) => void;
  removeService: (id: string) => void;
  clearServices: () => void;
  removedServiceIds: number[];
  // Produtos
  products: ProductData[];
  setProducts: (products: ProductData[]) => void;
  addProduct: (product: ProductData) => void;
  removeProduct: (id: string) => void;
  clearProducts: () => void;
  removedProductIds: number[];
  // Produto pendente (selecionado na busca, aguardando preenchimento do form)
  pendingProduct: { cod_subproduto: number; nome: string; marca: string; preco: number } | null;
  setPendingProduct: (p: { cod_subproduto: number; nome: string; marca: string; preco: number } | null) => void;
  // Problemas
  problemas: ProblemaData[];
  setProblemas: (problemas: ProblemaData[]) => void;
  addProblema: (data: Omit<ProblemaData, 'id'>) => void;
  updateProblema: (id: string, data: Partial<Omit<ProblemaData, 'id'>>) => void;
  removeProblema: (id: string) => void;
  // Ordem atualizada — preenchida pelo ServiceForm após update bem-sucedido,
  // consumida e limpa pelo OrderDetailScreen ao ganhar foco
  updatedOrder: Order | null;
  setUpdatedOrder: (order: Order | null) => void;
  // Geral
  clearFormData: () => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const FormDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [services, setServicesState] = useState<ServiceData[]>([]);
  const [products, setProductsState] = useState<ProductData[]>([]);
  const [removedServiceIds, setRemovedServiceIds] = useState<number[]>([]);
  const [removedProductIds, setRemovedProductIds] = useState<number[]>([]);
  const [pendingProduct, setPendingProduct] = useState<{
    cod_subproduto: number;
    nome: string;
    marca: string;
    preco: number;
  } | null>(null);
  const [problemas, setProblemasState] = useState<ProblemaData[]>([]);
  const [updatedOrder, setUpdatedOrder] = useState<Order | null>(null);

  // ─── Serviços ─────────────────────────────────────────────────────────────

  const setServices = (serviceList: ServiceData[]) => setServicesState(serviceList);

  const addService = (service: ServiceData) =>
    setServicesState(prev => [...prev, service]);

  const removeService = (id: string) => {
    setServicesState(prev => {
      const found = prev.find(s => s.id === id);
      if (found?.cod_servico != null) {
        setRemovedServiceIds(ids => [...ids, found.cod_servico!]);
      }
      return prev.filter(s => s.id !== id);
    });
  };

  const clearServices = () => {
    setServicesState([]);
    setRemovedServiceIds([]);
  };

  // ─── Produtos ─────────────────────────────────────────────────────────────

  const setProducts = (productList: ProductData[]) => setProductsState(productList);

  const addProduct = (product: ProductData) =>
    setProductsState(prev => [...prev, product]);

  const removeProduct = (id: string) => {
    setProductsState(prev => {
      const found = prev.find(p => p.id === id);
      if (found?.cod_itemProduto != null) {
        setRemovedProductIds(ids => [...ids, found.cod_itemProduto!]);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const clearProducts = () => {
    setProductsState([]);
    setRemovedProductIds([]);
  };

  // ─── Problemas ────────────────────────────────────────────────────────────

  const setProblemas = (problemaList: ProblemaData[]) => setProblemasState(problemaList);

  const addProblema = (data: Omit<ProblemaData, 'id'>) => {
    const newProblema: ProblemaData = {
      id: `local-${Date.now()}-${Math.random()}`,
      ...data,
    };
    setProblemasState(prev => [...prev, newProblema]);
  };

  const updateProblema = (id: string, data: Partial<Omit<ProblemaData, 'id'>>) => {
    setProblemasState(prev =>
      prev.map(p => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const removeProblema = (id: string) => {
    setProblemasState(prev => prev.filter(p => p.id !== id));
  };

  // ─── Geral ────────────────────────────────────────────────────────────────

  const clearFormData = () => {
    setSelectedClient(null);
    setSelectedVehicle(null);
    setServicesState([]);
    setProductsState([]);
    setRemovedServiceIds([]);
    setRemovedProductIds([]);
    setPendingProduct(null);
    setProblemasState([]);
    // Não limpa updatedOrder aqui — é responsabilidade do OrderDetailScreen
  };

  return (
    <FormDataContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        selectedVehicle,
        setSelectedVehicle,
        services,
        setServices,
        addService,
        removeService,
        clearServices,
        removedServiceIds,
        products,
        setProducts,
        addProduct,
        removeProduct,
        clearProducts,
        removedProductIds,
        pendingProduct,
        setPendingProduct,
        problemas,
        setProblemas,
        addProblema,
        updateProblema,
        removeProblema,
        updatedOrder,
        setUpdatedOrder,
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