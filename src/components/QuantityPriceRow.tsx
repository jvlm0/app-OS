// src/components/QuantityPriceRow.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface QuantityPriceRowProps {
  quantidade: string;
  onQuantidadeChange: (value: string) => void;
  valorUnitario: string;
  onValorUnitarioChange: (value: string) => void;
  quantidadeLabel?: string;
}

export const QuantityPriceRow = ({
  quantidade,
  onQuantidadeChange,
  valorUnitario,
  onValorUnitarioChange,
  quantidadeLabel = 'Quantidade',
}: QuantityPriceRowProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.row}>
      <View style={styles.halfField}>
        <Text style={styles.label}>
          {quantidadeLabel} <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor={colors.textPlaceholder}
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
          placeholderTextColor={colors.textPlaceholder}
          keyboardType="decimal-pad"
          value={valorUnitario}
          onChangeText={onValorUnitarioChange}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    halfField: { flex: 1 },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
    required: { color: colors.required },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      color: colors.inputText,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
  });
