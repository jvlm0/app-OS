// src/screens/ProductSearchScreen.tsx

import { ProductItem } from '@/components/search/ProductItem';
import { useFormData } from '@/contexts/FormDataContext';
import { GenericSearchScreen } from '@/screens/GenericSearchScreen';
import { fetchProducts } from '@/services/productService';
import type { RootStackParamList } from '@/types/navigation.types';
import type { Product } from '@/types/product.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PackagePlus } from 'lucide-react-native';
import React from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductSearch'>;

const ProductSearchScreen = ({ navigation }: Props) => {
  const { setPendingProduct } = useFormData();

  const handleSelectProduct = (product: Product) => {
    setPendingProduct({
      cod_subproduto: product.cod_subproduto,
      nome: product.nome,
      marca: product.marca,
      preco: product.preco,
    });
    navigation.goBack();
  };

  return (
    <GenericSearchScreen<Product>
      title="Buscar Produto"
      searchPlaceholder="Buscar por nome do produto"
      searchParam='nome'
      objectName='produto'
      icon={PackagePlus}
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