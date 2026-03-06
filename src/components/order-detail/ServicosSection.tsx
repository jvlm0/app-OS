// src/components/order-detail/ServicosSection.tsx

import { ItemRow } from '@/components/ItemRow';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { ServicoResponse } from '@/types/order-list.types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OrderSection } from './OrderSection';

interface ServicosSectionProps {
  servicos?: ServicoResponse[];
}

const fmtCurrency = (v: number) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`;

export const ServicosSection = ({ servicos }: ServicosSectionProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (!servicos || servicos.length === 0) return null;

  return (
    <OrderSection title={`Serviços (${servicos.length})`}>
      {servicos.map((s) => (
        <View key={s.cod_servico} style={styles.card}>
          <Text style={styles.title}>{s.descricao}</Text>
          <ItemRow label="Qtd:"           value={String(s.quantidade)} />
          <ItemRow label="Valor unitário:" value={fmtCurrency(s.valorUnitario)} />
          {s.desconto > 0 && (
            <ItemRow
              label={`Desconto (${s.desconto}%):`}
              value={fmtCurrency(s.quantidade * s.valorUnitario * s.desconto / 100)}
            />
          )}
          <ItemRow label="Equipe:"        value={s.equipe.nome} />
          {s.vendedores.length > 0 && (
            <ItemRow label="Vendedores:"  value={s.vendedores.map(v => v.nome).join(', ')} />
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
