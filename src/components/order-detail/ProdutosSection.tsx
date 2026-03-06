// src/components/order-detail/ProdutosSection.tsx

import { ItemRow } from '@/components/ItemRow';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { ItemProdutoResponse } from '@/types/order-list.types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OrderSection } from './OrderSection';

interface ProdutosSectionProps {
  produtos?: ItemProdutoResponse[];
}

const fmtCurrency = (v: number) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`;

export const ProdutosSection = ({ produtos }: ProdutosSectionProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (!produtos || produtos.length === 0) return null;

  return (
    <OrderSection title={`Produtos (${produtos.length})`}>
      {produtos.map((p) => (
        <View key={p.cod_itemProduto} style={styles.card}>
          <Text style={styles.title}>{p.nome}</Text>
          {p.marca && <ItemRow label="Marca:"         value={p.marca} />}
          <ItemRow label="Qtd:"           value={String(Number(p.quantidade))} />
          <ItemRow label="Valor unitário:" value={fmtCurrency(Number(p.valorUnitario))} />
          {Number(p.desconto) > 0 && (
            <ItemRow
              label={`Desconto (${p.desconto}%):`}
              value={fmtCurrency(p.quantidade * p.valorUnitario * p.desconto / 100)}
            />
          )}
          {p.vendedores.length > 0 && (
            <ItemRow label="Vendedores:"  value={p.vendedores.map(v => v.nome).join(', ')} />
          )}
        </View>
      ))}
    </OrderSection>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.dividerSubtle,
    },
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
  });
