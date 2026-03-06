// src/components/InfoRow.tsx
// Primitivo de apresentação: label + valor em linha.
// Genérico o suficiente para ser usado em qualquer tela de detalhe.

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InfoRowProps {
  label: string;
  value?: string | null;
}

export const InfoRow = ({ label, value }: InfoRowProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (!value) return null;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    label: {
      fontSize: 14,
      color: colors.textSecondary,
      width: 90,
      flexShrink: 0,
    },
    value: {
      fontSize: 14,
      color: colors.textPrimary,
      flex: 1,
      fontWeight: '500',
    },
  });
