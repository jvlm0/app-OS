// src/components/QuantityPriceRow.tsx

import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface QuantityPriceRowProps {
  quantidade: string;
  onQuantidadeChange: (value: string) => void;
  valorUnitario: string;
  onValorUnitarioChange: (value: string) => void;
  /** Label do campo de quantidade. Padrão: "Quantidade" */
  quantidadeLabel?: string;
}

/**
 * Par de campos em linha: Quantidade (esquerda) + Valor Unitário (direita).
 * Usado em AddProductScreen e AddServiceScreen.
 */
export const QuantityPriceRow = ({
  quantidade,
  onQuantidadeChange,
  valorUnitario,
  onValorUnitarioChange,
  quantidadeLabel = 'Quantidade',
}: QuantityPriceRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.halfField}>
        <Text style={styles.label}>
          {quantidadeLabel} <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={quantidade}
          onChangeText={onQuantidadeChange}
        />
      </View>

      <View style={styles.halfField}>
        <Text style={styles.label}>
          Valor Unitário <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={valorUnitario}
          onChangeText={onValorUnitarioChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  halfField: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#ff0000',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});
