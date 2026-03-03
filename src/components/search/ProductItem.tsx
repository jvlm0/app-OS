// src/components/search/ProductItem.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { Product } from '@/types/product.types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductItemProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductItem = ({ product, onPress }: ProductItemProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(product)}>
      <View style={styles.info}>
        <Text style={styles.name}>{product.nome}</Text>
        <Text style={styles.brand}>
          R$ {product.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - {product.marca}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      backgroundColor: colors.background,
    },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
    brand: { fontSize: 14, color: colors.textSecondary },
  });
