// src/components/search/ListEmptyState.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { Search, UserPlus } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ListEmptyStateProps {
  loading: boolean;
  hasSearched: boolean;
  searchQuery: string;
  onAddClient: () => void;
  objectName: string;
  searchParam: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}

export const ListEmptyState = ({
  loading,
  hasSearched,
  searchQuery,
  onAddClient,
  objectName = 'cliente',
  searchParam = 'nome ou telefone',
  icon: Icon = UserPlus,
}: ListEmptyStateProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Buscando {objectName}s...</Text>
      </View>
    );
  }

  if (searchQuery.trim() && hasSearched) {
    return (
      <View style={styles.container}>
        <Icon size={64} color={colors.iconMuted} />
        <Text style={styles.title}>Nenhum {objectName} encontrado</Text>
        <Text style={styles.text}>Não encontramos {objectName}s com "{searchQuery}"</Text>
        <TouchableOpacity style={styles.linkButton} onPress={onAddClient}>
          <Text style={styles.linkButtonText}>Cadastrar agora</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Search size={64} color={colors.iconMuted} />
      <Text style={styles.title}>Buscar {objectName}</Text>
      <Text style={styles.text}>Digite o {searchParam} do {objectName} para buscar</Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    title: { fontSize: 18, fontWeight: '600', color: colors.textMeta, marginTop: 16, marginBottom: 8 },
    text: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
    loadingText: { fontSize: 14, color: colors.textSecondary, marginTop: 12 },
    linkButton: { paddingVertical: 8 },
    linkButtonText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, textDecorationLine: 'underline' },
  });
