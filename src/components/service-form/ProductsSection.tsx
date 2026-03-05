// src/components/service-form/ProductsSection.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReadOnlyProductCard, { type ProductData } from './ReadOnlyProductCard';

interface ProductsSectionProps {
  products: ProductData[];
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const ProductsSection = ({ products, expanded, onToggle, onAdd, onRemove }: ProductsSectionProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.header} onPress={() => onToggle(!expanded)}>
          <Text style={styles.label}>
            Produtos (opcional){products.length > 0 ? ` · ${products.length}` : ''}
          </Text>
          {expanded
            ? <ChevronUp size={20} color={colors.iconDefault} />
            : <ChevronDown size={20} color={colors.iconDefault} />}
        </TouchableOpacity>
        {expanded && (
          <View style={styles.body}>
            <View style={styles.divider} />
            <View style={styles.content}>
              {products.map((product, index) => (
                <ReadOnlyProductCard key={product.id} product={product} index={index} onRemove={onRemove} />
              ))}
              <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                <Text style={styles.addText}>+ Adicionar produto</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginBottom: 24 },
    card: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      overflow: 'hidden',
    },
    header: {
      backgroundColor: colors.backgroundMuted,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    body: {
      backgroundColor: colors.sectionBody,
    },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    divider: { height: 1, backgroundColor: colors.divider },
    content: { padding: 16, gap: 12 },
    addButton: {
      backgroundColor: colors.backgroundMuted,
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderDashed,
      borderStyle: 'dashed',
    },
    addText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  });

export default ProductsSection;
