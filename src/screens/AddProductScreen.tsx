// src/screens/AddProductScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import { useFormData } from '@/contexts/FormDataContext';
import { fetchVendedores } from '@/services/teamVendorService';
import type { RootStackParamList } from '@/types/navigation.types';
import type { Equipe, Vendedor } from '@/types/team-vendor.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronDown, Search } from 'lucide-react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AddProductScreenProps = NativeStackScreenProps<RootStackParamList, 'AddProduct'>;

const ITEM_HEIGHT = 53;
const VISIBLE_ITEMS = 4;

const AddProductScreen = ({ navigation }: AddProductScreenProps) => {
  const insets = useSafeAreaInsets();
  const { addProduct, pendingProduct, setPendingProduct } = useFormData();

  const [quantidade, setQuantidade] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [desconto, setDesconto] = useState('');
  const [equipeId, setEquipeId] = useState<number | null>(null);
  const [vendedoresSelecionados, setVendedoresSelecionados] = useState<number[]>([]);

  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loadingEquipes, setLoadingEquipes] = useState(true);
  const [loadingVendedores, setLoadingVendedores] = useState(true);

  const [showVendedoresDropdown, setShowVendedoresDropdown] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [vendedoresResult] = await Promise.all([
        
        fetchVendedores(),
      ]);

      

      if (vendedoresResult.success && vendedoresResult.data) {
        setVendedores(vendedoresResult.data);
      } else {
        Alert.alert('Atenção', vendedoresResult.error || 'Não foi possível carregar os vendedores.');
      }

      setLoadingEquipes(false);
      setLoadingVendedores(false);
    };

    loadData();
  }, []);

  // Limpa o produto pendente ao desmontar (caso o usuário feche sem salvar)
  useEffect(() => {
    return () => {
      setPendingProduct(null);
    };
  }, []);

  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const amount = parseInt(numbers, 10) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const num = parseInt(numbers, 10);
    if (num > 100) return '100';
    return num.toString();
  };

  const toggleVendedor = (id: number) => {
    setVendedoresSelecionados(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id],
    );
  };

  const handleOpenProductSearch = () => {
    navigation.navigate('ProductSearch');
  };

  const handleSave = () => {
    if (!pendingProduct) {
      Alert.alert('Atenção', 'Por favor, selecione um produto');
      return;
    }
    if (!quantidade.trim() || parseFloat(quantidade) <= 0) {
      Alert.alert('Atenção', 'Por favor, preencha uma quantidade válida');
      return;
    }
    if (!valorUnitario.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o valor unitário');
      return;
    }
    if (!equipeId) {
      Alert.alert('Atenção', 'Por favor, selecione uma equipe');
      return;
    }
    if (vendedoresSelecionados.length === 0) {
      Alert.alert('Atenção', 'Por favor, selecione pelo menos um vendedor');
      return;
    }

    const equipe = equipes.find(e => e.cod_equipe === equipeId);
    const vendedoresFiltrados = vendedores.filter(v =>
      vendedoresSelecionados.includes(v.cod_vendedor),
    );

    addProduct({
      id: Date.now().toString(),
      cod_subproduto: pendingProduct.cod_subproduto,
      nomeProduto: pendingProduct.nome,
      quantidade: parseFloat(quantidade),
      valorUnitario: parseFloat(valorUnitario.replace(/\./g, '').replace(',', '.')),
      desconto: desconto ? parseFloat(desconto) : 0,
      cod_vendedores: vendedoresSelecionados,
      vendedores: vendedoresFiltrados.map(v => v.nome),
    });

    setPendingProduct(null);
    navigation.goBack();
  };

  const equipeNome = equipeId ? equipes.find(e => e.cod_equipe === equipeId)?.nome : '';
  const vendedoresNomes = vendedores
    .filter(v => vendedoresSelecionados.includes(v.cod_vendedor))
    .map(v => v.nome)
    .join(', ');

  const isLoading = loadingEquipes || loadingVendedores;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ModalHeader
        title="Adicionar Produto"
        onClose={() => navigation.goBack()}
        insetsTop={insets.top}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          <View style={styles.formContainer}>

            {/* Campo "fake" de produto — abre a busca */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Produto <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity style={styles.productSelector} onPress={handleOpenProductSearch}>
                {pendingProduct ? (
                  <Text style={styles.productSelectorText} numberOfLines={1}>
                    {pendingProduct.nome}
                  </Text>
                ) : (
                  <Text style={styles.productSelectorPlaceholder}>
                    Buscar produto...
                  </Text>
                )}
                <Search size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Quantidade e Valor Unitário */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>
                  Quantidade <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={quantidade}
                  onChangeText={setQuantidade}
                />
              </View>

              <View style={styles.halfField}>
                <Text style={styles.label}>
                  Valor Unitário <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={valorUnitario}
                  onChangeText={value => setValorUnitario(formatCurrency(value))}
                />
              </View>
            </View>

            {/* Desconto */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Desconto (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={desconto}
                onChangeText={value => setDesconto(formatPercentage(value))}
                maxLength={3}
              />
            </View>

            

            {/* Dropdown Vendedores */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Vendedor(es) <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowVendedoresDropdown(prev => !prev);
                  
                }}
              >
                <Text style={[styles.dropdownText, !vendedoresNomes && styles.placeholder]}>
                  {vendedoresNomes || 'Selecione um ou mais vendedores'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>

              {showVendedoresDropdown && (
                <View
                  style={[
                    styles.dropdownList,
                    { height: Math.min(vendedores.length, VISIBLE_ITEMS) * ITEM_HEIGHT },
                  ]}
                >
                  <ScrollView
                    nestedScrollEnabled
                    bounces={false}
                    showsVerticalScrollIndicator={vendedores.length > VISIBLE_ITEMS}
                    keyboardShouldPersistTaps="handled"
                  >
                    {vendedores.map(vendedor => {
                      const isSelected = vendedoresSelecionados.includes(vendedor.cod_vendedor);
                      return (
                        <TouchableOpacity
                          key={vendedor.cod_vendedor}
                          style={[
                            styles.dropdownItem,
                            isSelected && styles.dropdownItemSelected,
                          ]}
                          onPress={() => toggleVendedor(vendedor.cod_vendedor)}
                        >
                          <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                              {isSelected && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text
                              style={[
                                styles.dropdownItemText,
                                isSelected && styles.dropdownItemTextSelected,
                              ]}
                            >
                              {vendedor.nome}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
              <Text style={styles.submitButtonText}>Adicionar Produto</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { fontSize: 16, color: '#666' },
  formContainer: { padding: 20 },
  fieldContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8 },
  required: { color: '#ff0000' },
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
  row: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  halfField: { flex: 1 },
  dropdown: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownText: { fontSize: 16, color: '#000', flex: 1 },
  placeholder: { color: '#999' },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  dropdownItem: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: { backgroundColor: '#f5f5f5' },
  dropdownItemText: { fontSize: 16, color: '#000' },
  dropdownItemTextSelected: { fontWeight: '600' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#000', borderColor: '#000' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default AddProductScreen;