// src/contexts/FormDataContext.tsx

import type { ServiceData } from '@/components/service-form/ReadOnlyServiceCard';
import React, { createContext, useContext, useState } from 'react';
import type { Client } from '../types/client.types';
import type { Vehicle } from '../types/vehicle.types';

interface FormDataContextType {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  services: ServiceData[];
  addService: (service: ServiceData) => void;
  removeService: (id: string) => void;
  clearServices: () => void;
  clearFormData: () => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const FormDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);

  const addService = (service: ServiceData) => {
    setServices(prev => [...prev, service]);
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const clearServices = () => {
    setServices([]);
  };

  const clearFormData = () => {
    setSelectedClient(null);
    setSelectedVehicle(null);
    setServices([]);
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