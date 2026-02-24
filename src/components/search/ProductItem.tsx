// src/components/search/ProductItem.tsx

import type { Product } from '@/types/product.types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductItemProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductItem = ({ product, onPress }: ProductItemProps) => (

  <TouchableOpacity style={styles.container} onPress={() => onPress(product)}>
    <View style={styles.info}>
      <Text style={styles.name}>{product.nome}</Text>
      <Text style={styles.brand}>R$ {product.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - {product.marca}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 4 },
  brand: { fontSize: 14, color: '#666' },
});