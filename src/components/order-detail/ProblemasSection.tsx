// src/components/order-detail/ProblemasSection.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { ProblemaOrdem } from '@/types/order.types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OrderSection } from './OrderSection';

interface ProblemasSectionProps {
  problemas: ProblemaOrdem[];
}

export const ProblemasSection = ({ problemas }: ProblemasSectionProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (!problemas || problemas.length === 0) return null;

  return (
    <OrderSection title={`Problemas Relatados (${problemas.length})`}>
      {problemas.map((p, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.index}>PROBLEMA {i + 1}</Text>
          </View>

          <View style={styles.block}>
            <Text style={styles.fieldLabel}>Problema Relatado</Text>
            <Text style={styles.text}>{p.descricao}</Text>
          </View>

          {p.solucao ? (
            <View style={[styles.block, styles.solucaoBlock]}>
              <Text style={styles.fieldLabel}>Solução</Text>
              <Text style={styles.text}>{p.solucao}</Text>
            </View>
          ) : (
            <View style={styles.semSolucaoBadge}>
              <Text style={styles.semSolucaoText}>Sem solução registrada</Text>
            </View>
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
    header: {
      marginBottom: 12,
    },
    index: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    block: {
      marginBottom: 10,
    },
    solucaoBlock: {
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.dividerSubtle,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    text: {
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    semSolucaoBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.semSolucaoBg,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.semSolucaoBorder,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginTop: 4,
    },
    semSolucaoText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.semSolucaoText,
    },
  });
