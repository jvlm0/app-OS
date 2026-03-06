// src/components/order-detail/OrderStatusBadge.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface OrderStatusBadgeProps {
  status: string;
}

const getStatusBadgeStyle = (status: string, colors: AppColors) => {
  switch (status?.toLowerCase()) {
    case 'aberta':
    case 'aberto':
      return { backgroundColor: colors.statusAbertaBg, borderColor: colors.statusAbertaBorder };
    case 'concluída':
    case 'concluido':
    case 'concluída':
      return { backgroundColor: colors.statusConcluidaBg, borderColor: colors.statusConcluidaBorder };
    case 'cancelada':
    case 'cancelado':
      return { backgroundColor: colors.statusCanceladaBg, borderColor: colors.statusCanceladaBorder };
    default:
      return { backgroundColor: colors.statusNeutralBg, borderColor: colors.statusNeutralBorder };
  }
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={[styles.badge, getStatusBadgeStyle(status, colors)]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
    },
    text: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.statusDetailText,
    },
  });
