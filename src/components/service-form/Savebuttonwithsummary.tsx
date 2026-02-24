import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ServiceData {
  valorUnitario: number;
  quantidade?: number;
  desconto?: number; // valor absoluto ou percentual — ajuste conforme seu tipo real
}

interface ProductData {
  valorUnitario: number;
  quantidade?: number;
  desconto?: number;
}

interface SaveButtonWithSummaryProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  text?: string;
  floating?: boolean;
  services: ServiceData[];
  products: ProductData[];
}

/**
 * Calcula subtotal (quantidade * valorUnitario) e soma de descontos
 * para uma lista de itens.
 */
function calcTotals(items: (ServiceData | ProductData)[]) {
  let subtotal = 0;
  let discounts = 0;

  for (const item of items) {
    const qty = item.quantidade ?? 1;
    subtotal += qty * item.valorUnitario;

    const itemDiscount = (qty * item.valorUnitario * (item.desconto ?? 0)) / 100;

    discounts += itemDiscount;
  }

  return { subtotal, discounts };
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
  const insets = useSafeAreaInsets();

  const { subtotal: svcSubtotal, discounts: svcDiscounts } = calcTotals(services);
  const { subtotal: prdSubtotal, discounts: prdDiscounts } = calcTotals(products);

  const totalDiscounts = svcDiscounts + prdDiscounts;
  const totalValue = svcSubtotal + prdSubtotal - totalDiscounts;

  const hasSummary = totalValue > 0;

  return (
    <View
      style={[
        floating ? styles.footerFloat : styles.footerNormal,
        { paddingBottom: floating ? insets.bottom + 20 : 20 },
      ]}
    >
      <View style={styles.row}>
        {/* ─── Resumo (esquerda) — só exibe quando há valores ── */}
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

        {/* ─── Botão (direita) ───────────────────────────────── */}
        <TouchableOpacity
          style={[styles.saveButton, !hasSummary && styles.saveButtonFull, (loading || disabled) && styles.saveButtonDisabled]}
          onPress={onPress}
          disabled={loading || disabled}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>{text}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerFloat: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerNormal: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  summary: {
    flex: 1,
    alignItems: 'flex-end', // alinha o conteúdo à direita do bloco esquerdo
    gap: 2,
  },
  summaryLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  discountValue: {
    color: '#e53935', // vermelho para indicar desconto
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  saveButtonFull: {
    flex: 1,
  },
  saveButtonDisabled: {
    backgroundColor: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});