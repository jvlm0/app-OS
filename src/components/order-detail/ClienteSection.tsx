// src/components/order-detail/ClienteSection.tsx

import { InfoRow } from '@/components/InfoRow';
import type { Client } from '@/types/client.types';
import React from 'react';
import { OrderSection } from './OrderSection';

interface ClienteSectionProps {
  cliente: Client;
}

export const ClienteSection = ({ cliente }: ClienteSectionProps) => (
  <OrderSection title="Cliente">
    <InfoRow label="Nome" value={cliente.nome} />
    <InfoRow label="Telefone" value={cliente.telefone} />
    <InfoRow label="CPF/CNPJ" value={cliente.cpfcnpj} />
  </OrderSection>
);
