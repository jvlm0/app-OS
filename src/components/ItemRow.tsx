// src/components/ItemRow.tsx
// Primitivo de apresentação: label + valor para itens comerciais (serviços, produtos).
// Genérico o suficiente para ser usado em qualquer tela de detalhe.

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ItemRowProps {
  label: string;
  value: string;
}

export const ItemRow = ({ label, value }: ItemRowProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    label: {
      fontSize: 13,
      color: colors.textSecondary,
      width: 110,
      flexShrink: 0,
    },
    value: {
      fontSize: 13,
      color: colors.textMeta,
      flex: 1,
      fontWeight: '500',
    },
  });
