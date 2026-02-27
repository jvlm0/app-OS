// src/components/service-form/ReadOnlyServiceCard.tsx

import { Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TAX_RATE = 0;

export interface ServiceData {
  id: string;
  cod_servico?: number; // presente apenas em serviços já salvos na API
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  cod_equipe: number;
  equipe: string;
  vendedores: string[];
  cod_vendedores: number[];
}

interface ReadOnlyServiceCardProps {
  service: ServiceData;
  index: number;
  onRemove: (id: string) => void;
}

const ReadOnlyServiceCard = ({ service, index, onRemove }: ReadOnlyServiceCardProps) => {
  const subtotal = service.quantidade * service.valorUnitario;
  const descontoValor = (subtotal * service.desconto) / 100;
  const subtotalComDesconto = subtotal - descontoValor;
  const impostos = subtotalComDesconto * TAX_RATE;
  const total = subtotalComDesconto;
  const subtotalS = subtotal - impostos - descontoValor;

  const formatMoney = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>SERVIÇO {index + 1}</Text>
        <TouchableOpacity onPress={() => onRemove(service.id)} style={styles.deleteButton}>
          <Trash2 size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Descrição:</Text>
        <Text style={styles.infoValue}>{service.descricao}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.halfInfo}>
          <Text style={styles.infoLabel}>Quantidade:</Text>
          <Text style={styles.infoValue}>{service.quantidade}h</Text>
        </View>
        <View style={styles.halfInfo}>
          <Text style={styles.infoLabel}>Valor Unit.:</Text>
          <Text style={styles.infoValue}>{formatMoney(service.valorUnitario)}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Equipe:</Text>
        <Text style={styles.infoValue}>{service.equipe}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Vendedor(es):</Text>
        <Text style={styles.infoValue}>{service.vendedores.join(', ')}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.calculationRow}>
        <Text style={styles.calculationLabel}>Subtotal:</Text>
        <Text style={styles.calculationValue}>{formatMoney(subtotalS)}</Text>
      </View>

      {service.desconto > 0 && (
        <View style={styles.calculationRow}>
          <Text style={styles.calculationLabel}>Desconto ({service.desconto}%):</Text>
          <Text style={[styles.calculationValue, styles.discountText]}>
            -{formatMoney(descontoValor)}
          </Text>
        </View>
      )}

      {impostos > 0 && (
        <View style={styles.calculationRow}>
          <Text style={styles.calculationLabel}>Impostos ({TAX_RATE * 100}%):</Text>
          <Text style={styles.calculationValue}>{formatMoney(impostos)}</Text>
        </View>
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>TOTAL:</Text>
        <Text style={styles.totalValue}>{formatMoney(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
  deleteButton: { padding: 4 },
  infoRow: { marginBottom: 12 },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: { fontSize: 15, color: '#000' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  halfInfo: { flex: 1 },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calculationLabel: { fontSize: 14, color: '#666' },
  calculationValue: { fontSize: 14, color: '#000', fontWeight: '500' },
  discountText: { color: '#22c55e' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#000' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#000' },
});

export default ReadOnlyServiceCard;