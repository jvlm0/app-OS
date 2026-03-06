// src/components/order-list/OrderListEmptyState.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { FileText, RefreshCw } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OrderListEmptyStateProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const OrderListEmptyState = ({ loading, error, onRetry }: OrderListEmptyStateProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando ordens...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <FileText size={64} color={colors.iconMuted} />
        <Text style={styles.title}>Erro ao carregar</Text>
        <Text style={styles.message}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw size={20} color={colors.onPrimary} />
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FileText size={64} color={colors.iconMuted} />
      <Text style={styles.title}>Nenhuma ordem encontrada</Text>
      <Text style={styles.message}>
        Crie sua primeira ordem de serviço tocando no botão + abaixo
      </Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.textMeta,
      marginTop: 16,
      marginBottom: 8,
    },
    message: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16,
    },
    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 24,
      gap: 8,
    },
    retryText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.onPrimary,
    },
  });
