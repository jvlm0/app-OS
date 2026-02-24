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
  const insets = useSafeAreaInsets();
  
  const subtotal = quantidade * valorUnitario;
  desconto = subtotal * (desconto / 100); 
  const total = subtotal - desconto;
  //const hasSummary = subtotal > 0;
  const hasSummary = true; 
  return (
    <View
      style={[
        floating ? styles.footerFloat : styles.footerNormal,
        { paddingBottom: floating ? insets.bottom + 20 : 20 },
      ]}
    >
      <View style={styles.row}>
        {hasSummary && (
          <View style={styles.summary}>
            {desconto > 0 && (
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Desconto</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  - {formatBRL(desconto)}
                </Text>
              </View>
            )}
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatBRL(total)}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            !hasSummary && styles.saveButtonFull,
            (loading || disabled) && styles.saveButtonDisabled,
          ]}
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
    alignItems: 'flex-end',
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
    color: '#e53935',
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