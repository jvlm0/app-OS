// src/components/service-form/Savebuttonwithsummary.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ServiceData { valorUnitario: number; quantidade?: number; desconto?: number }
interface ProductData { valorUnitario: number; quantidade?: number; desconto?: number }

interface SaveButtonWithSummaryProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  text?: string;
  floating?: boolean;
  services: ServiceData[];
  products: ProductData[];
}

function calcTotals(items: (ServiceData | ProductData)[]) {
  let subtotal = 0;
  let discounts = 0;
  for (const item of items) {
    const qty = item.quantidade ?? 1;
    subtotal += qty * item.valorUnitario;
    discounts += (qty * item.valorUnitario * (item.desconto ?? 0)) / 100;
  }
  return { subtotal, discounts };
}

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const SaveButtonWithSummary = ({
  onPress,
  loading = false,
  disabled = false,
  text = 'Salvar',
  floating = true,
  services,
  products,
}: SaveButtonWithSummaryProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const insets = useSafeAreaInsets();

  const { subtotal: svcSub, discounts: svcDisc } = calcTotals(services);
  const { subtotal: prdSub, discounts: prdDisc } = calcTotals(products);
  const totalDiscounts = svcDisc + prdDisc;
  const totalValue = svcSub + prdSub - totalDiscounts;
  const hasSummary = totalValue > 0;

  return (
    <View style={[
      floating ? styles.footerFloat : styles.footerNormal,
      { paddingBottom: floating ? insets.bottom + 20 : 20 },
    ]}>
      <View style={styles.row}>
        {hasSummary && (
          <View style={styles.summary}>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Descontos</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                {totalDiscounts > 0 ? `- ${formatBRL(totalDiscounts)}` : formatBRL(0)}
              </Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatBRL(totalValue)}</Text>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={[styles.saveButton, !hasSummary && styles.saveButtonFull, (loading || disabled) && styles.saveButtonDisabled]}
          onPress={onPress}
          disabled={loading || disabled}
        >
          {loading
            ? <ActivityIndicator size="small" color={colors.onPrimary} />
            : <Text style={styles.saveButtonText}>{text}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    footerFloat: {
      position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: 20, paddingBottom: 20,
      backgroundColor: colors.background,
      borderTopWidth: 1, borderTopColor: colors.border,
    },
    footerNormal: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
    row: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    summary: { flex: 1, alignItems: 'flex-end', gap: 2 },
    summaryLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    summaryLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
    summaryValue: { fontSize: 13, fontWeight: '600', color: colors.textMeta },
    discountValue: { color: colors.textDiscount },
    totalValue: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
    saveButton: {
      backgroundColor: colors.primary, borderRadius: 8,
      paddingVertical: 18, paddingHorizontal: 24,
      alignItems: 'center', justifyContent: 'center', minWidth: 140,
    },
    saveButtonFull: { flex: 1 },
    saveButtonDisabled: { backgroundColor: colors.primaryDisabled },
    saveButtonText: { fontSize: 16, fontWeight: '600', color: colors.onPrimary },
  });
