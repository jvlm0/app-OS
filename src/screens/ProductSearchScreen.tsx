// src/screens/ProductSearchScreen.tsx

import { ProductItem } from '@/components/search/ProductItem';
import { GenericSearchScreen } from '@/screens/GenericSearchScreen';
import { fetchProducts } from '@/services/productService';
import type { RootStackParamList } from '@/types/navigation.types';
import type { Product } from '@/types/product.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductSearch'>;

const ProductSearchScreen = ({ navigation }: Props) => {
  const handleSelectProduct = (product: Product) => {
    // Faça o que precisar com o produto selecionado
    // ex.: navigation.goBack() + passar via contexto ou params
    console.log('Produto selecionado:', product);
    navigation.goBack();
  };

  return (
    <GenericSearchScreen<Product>
      title="Buscar Produto"
      searchPlaceholder="Buscar por nome do produto"
      fetchFn={fetchProducts}
      keyExtractor={item => item.cod_subproduto.toString()}
      renderItem={item => (
        <ProductItem product={item} onPress={handleSelectProduct} />
      )}
      onClose={() => navigation.goBack()}
    />
  );
};

export default ProductSearchScreen;