// src/components/ItemPriceFooter.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ItemPriceFooterProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  text?: string;
  floating?: boolean;
  quantidade: number;
  valorUnitario: number;
  desconto?: number;
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const ItemPriceFooter = ({
  onPress,
  loading = false,
  disabled = false,
  text = 'Adicionar',
  floating = true,
  quantidade,
  valorUnitario,
  desconto = 0,
}: ItemPriceFooterProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const insets = useSafeAreaInsets();

  const subtotal = quantidade * valorUnitario;
  const descontoValor = subtotal * (desconto / 100);
  const total = subtotal - descontoValor;

  return (
    <View
      style={[
        floating ? styles.footerFloat : styles.footerNormal,
        { paddingBottom: floating ? insets.bottom + 20 : 20 },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.summary}>
          {descontoValor > 0 && (
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Desconto</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                - {formatBRL(descontoValor)}
              </Text>
            </View>
          )}
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatBRL(total)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, (loading || disabled) && styles.saveButtonDisabled]}
          onPress={onPress}
          disabled={loading || disabled}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text style={styles.saveButtonText}>{text}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    footerFloat: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 20,
      paddingBottom: 20,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerNormal: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    summary: { flex: 1, alignItems: 'flex-end', gap: 2 },
    summaryLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    summaryLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
    summaryValue: { fontSize: 13, fontWeight: '600', color: colors.textMeta },
    discountValue: { color: colors.textDiscount },
    totalValue: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 18,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 140,
    },
    saveButtonDisabled: { backgroundColor: colors.primaryDisabled },
    saveButtonText: { fontSize: 16, fontWeight: '600', color: colors.onPrimary },
  });
