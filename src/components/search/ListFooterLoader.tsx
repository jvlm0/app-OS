// src/components/search/ListFooterLoader.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface ListFooterLoaderProps {
  visible: boolean;
}

export const ListFooterLoader = ({ visible }: ListFooterLoaderProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={styles.text}>Carregando mais...</Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { paddingVertical: 20, alignItems: 'center', gap: 8 },
    text: { fontSize: 12, color: colors.textSecondary },
  });
