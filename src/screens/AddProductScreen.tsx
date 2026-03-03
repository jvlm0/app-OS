// src/screens/AddProductScreen.tsx

import { DropdownSelect } from '@/components/DropdownSelect';
import { FormField } from '@/components/FormField';
import { ItemPriceFooter } from '@/components/ItemPriceFooter';
import ModalHeader from '@/components/ModalHeader';
import { QuantityPriceRow } from '@/components/QuantityPriceRow';
import { useFormData } from '@/contexts/FormDataContext';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import { useTeamVendorData } from '@/hooks/useTeamVendorData';
import type { RootStackParamList } from '@/types/navigation.types';
import { formatCurrency, formatPercentage, parseCurrency, parseQuantity } from '@/utils/formatters';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'AddProduct'>;

const AddProductScreen = ({ navigation }: Props) => {
  const { addProduct, pendingProduct, setPendingProduct } = useFormData();
  const isKeyboardVisible = useKeyboardVisibility();
  const { vendedores, isLoading } = useTeamVendorData({ skipEquipes: true });

  const [quantidade, setQuantidade] = useState('1');
  const [valorUnitario, setValorUnitario] = useState('');
  const [desconto, setDesconto] = useState('');
  const [vendedoresSelecionados, setVendedoresSelecionados] = useState<number[]>([]);
  const [showVendedoresDropdown, setShowVendedoresDropdown] = useState(false);

  // Pré-preenche o valor unitário quando um produto é selecionado na busca
  useEffect(() => {
    if (pendingProduct?.preco != null) {
      setValorUnitario(
        pendingProduct.preco.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      );
    }
  }, [pendingProduct]);

  // Limpa o produto pendente ao desmontar (caso o usuário feche sem salvar)
  useEffect(() => {
    return () => {
      setPendingProduct(null);
    };
  }, []);

  const toggleVendedor = (id: number) => {
    setVendedoresSelecionados(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    if (!pendingProduct) {
      Alert.alert('Atenção', 'Por favor, selecione um produto');
      return;
    }
    if (!quantidade.trim() || parseQuantity(quantidade) <= 0) {
      Alert.alert('Atenção', 'Por favor, preencha uma quantidade válida');
      return;
    }
    if (!valorUnitario.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o valor unitário');
      return;
    }
    if (vendedoresSelecionados.length === 0) {
      Alert.alert('Atenção', 'Por favor, selecione pelo menos um vendedor');
      return;
    }

    const vendedoresFiltrados = vendedores.filter(v =>
      vendedoresSelecionados.includes(v.cod_vendedor),
    );

    addProduct({
      id: Date.now().toString(),
      cod_subproduto: pendingProduct.cod_subproduto,
      nomeProduto: pendingProduct.nome,
      quantidade: parseQuantity(quantidade),
      valorUnitario: parseCurrency(valorUnitario),
      desconto: desconto ? parseQuantity(desconto) : 0,
      cod_vendedores: vendedoresSelecionados,
      vendedores: vendedoresFiltrados.map(v => v.nome),
    });

    setPendingProduct(null);
    navigation.goBack();
  };

  const vendedoresNomes = vendedores
    .filter(v => vendedoresSelecionados.includes(v.cod_vendedor))
    .map(v => v.nome)
    .join(', ');

  const footerProps = {
    onPress: handleSave,
    loading: false,
    text: 'Adicionar',
    quantidade: parseQuantity(quantidade),
    valorUnitario: parseCurrency(valorUnitario),
    desconto: desconto ? parseQuantity(desconto) : 0,
  };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ModalHeader title="Adicionar Produto" onClose={() => navigation.goBack()} />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: !isKeyboardVisible ? 100 : 0 }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <View style={styles.formContainer}>

              {/* Seletor de produto */}
              <FormField label="Produto" required>
                <TouchableOpacity
                  style={styles.productSelector}
                  onPress={() => navigation.navigate('ProductSearch')}
                >
                  {pendingProduct ? (
                    <Text style={styles.productSelectorText} numberOfLines={1}>
                      {pendingProduct.nome} - {pendingProduct.marca}
                    </Text>
                  ) : (
                    <Text style={styles.productSelectorPlaceholder}>Buscar produto...</Text>
                  )}
                  <Search size={20} color="#666" />
                </TouchableOpacity>
              </FormField>

              {/* Quantidade + Valor Unitário */}
              <QuantityPriceRow
                quantidade={quantidade}
                onQuantidadeChange={setQuantidade}
                valorUnitario={valorUnitario}
                onValorUnitarioChange={value => setValorUnitario(formatCurrency(value))}
              />

              {/* Desconto */}
              <FormField label="Desconto (%)">
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={desconto}
                  onChangeText={value => setDesconto(formatPercentage(value))}
                  maxLength={6}
                />
              </FormField>

              {/* Vendedores */}
              <DropdownSelect
                label="Vendedor(es)"
                required
                placeholder="Selecione um ou mais vendedores"
                displayValue={vendedoresNomes}
                items={vendedores.map(v => ({ id: v.cod_vendedor, label: v.nome }))}
                mode="multi"
                selectedIds={vendedoresSelecionados}
                onSelect={toggleVendedor}
                isOpen={showVendedoresDropdown}
                onToggle={() => setShowVendedoresDropdown(prev => !prev)}
              />

            </View>

            {isKeyboardVisible && <ItemPriceFooter {...footerProps} floating={false} />}
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      {!isKeyboardVisible && <ItemPriceFooter {...footerProps} floating />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { fontSize: 16, color: '#666' },
  formContainer: { padding: 20 },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productSelector: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productSelectorText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  productSelectorPlaceholder: {
    fontSize: 16,
    color: '#999',
    flex: 1,
  },
});

export default AddProductScreen;
