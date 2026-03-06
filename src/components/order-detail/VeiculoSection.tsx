// src/components/order-detail/VeiculoSection.tsx

import { InfoRow } from '@/components/InfoRow';
import type { OrderVehicle } from '@/types/order-list.types';
import React from 'react';
import { OrderSection } from './OrderSection';

interface VeiculoSectionProps {
  veiculo: OrderVehicle;
}

export const VeiculoSection = ({ veiculo }: VeiculoSectionProps) => (
  <OrderSection title="Veículo">
    <InfoRow label="Placa"   value={veiculo.placa} />
    <InfoRow label="Modelo"  value={veiculo.modelo} />
    <InfoRow label="Ano"     value={veiculo.ano} />
    <InfoRow label="Km atual" value={veiculo.kmatual != null ? `${veiculo.kmatual} km` : null} />
    <InfoRow label="Cor"     value={veiculo.cor} />
    <InfoRow label="Marca"   value={veiculo.marca} />
    <InfoRow label="Chassi"  value={veiculo.chassi} />
  </OrderSection>
);
