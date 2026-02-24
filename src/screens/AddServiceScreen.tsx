// src/screens/AddServiceScreen.tsx

import { ItemPriceFooter } from '@/components/ItemPriceFooter';
import ModalHeader from '@/components/ModalHeader';
import { useFormData } from '@/contexts/FormDataContext';
import { fetchEquipes, fetchVendedores } from '@/services/teamVendorService';
import type { RootStackParamList } from '@/types/navigation.types';
import type { Equipe, Vendedor } from '@/types/team-vendor.types';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronDown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
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

type AddServiceScreenProps = NativeStackScreenProps<RootStackParamList, 'AddService'>;

// Altura fixa de cada item — deve bater com o style dropdownItem (height: ITEM_HEIGHT)
const ITEM_HEIGHT = 53;
// Quantos itens aparecem antes de precisar rolar
const VISIBLE_ITEMS = 4;

const AddServiceScreen = ({ navigation }: AddServiceScreenProps) => {
  const { addService } = useFormData();
  const isFocused = useIsFocused();

  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [desconto, setDesconto] = useState('');
  const [equipeId, setEquipeId] = useState<number | null>(null);
  const [vendedoresSelecionados, setVendedoresSelecionados] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loadingEquipes, setLoadingEquipes] = useState(true);
  const [loadingVendedores, setLoadingVendedores] = useState(true);

  const [showEquipeDropdown, setShowEquipeDropdown] = useState(false);
  const [showVendedoresDropdown, setShowVendedoresDropdown] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!isFocused) return;

    Keyboard.dismiss();
    setIsKeyboardVisible(false);

    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isFocused]);

  useEffect(() => {
    const loadData = async () => {
      const [equipesResult, vendedoresResult] = await Promise.all([
        fetchEquipes(),
        fetchVendedores(),
      ]);

      if (equipesResult.success && equipesResult.data) {
        setEquipes(equipesResult.data);
      } else {
        Alert.alert('Atenção', equipesResult.error || 'Não foi possível carregar as equipes.');
      }

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
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha a descrição do serviço');
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
      vendedoresSelecionados.includes(v.cod_vendedor)
    );

    const serviceData = {
      id: Date.now().toString(),
      descricao,
      quantidade: parseFloat(quantidade.replace(',','.')),
      valorUnitario: parseFloat(valorUnitario.replace(/\./g, '').replace(',', '.')),
      desconto: desconto ? parseFloat(desconto.replace(',','.')) : 0,
      cod_equipe: equipeId,
      equipe: equipe?.nome || '',
      cod_vendedores: vendedoresSelecionados,
      vendedores: vendedoresFiltrados.map(v => v.nome),
    };

    addService(serviceData);
    navigation.goBack();
  };

  const equipeNome = equipeId
    ? equipes.find(e => e.cod_equipe === equipeId)?.nome
    : '';

  const vendedoresNomes = vendedores
    .filter(v => vendedoresSelecionados.includes(v.cod_vendedor))
    .map(v => v.nome)
    .join(', ');

  const isLoading = loadingEquipes || loadingVendedores;

  return (
    <SafeAreaView style={styles.flex}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ModalHeader
        title="Adicionar Serviço"
        onClose={() => navigation.goBack()}
        
      />

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

            {/* Descrição */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Descrição <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Mão de obra"
                placeholderTextColor="#999"
                value={descricao}
                onChangeText={setDescricao}
              />
            </View>

            {/* Quantidade e Valor Unitário */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>
                  Quantidade (horas) <Text style={styles.required}>*</Text>
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

            {/* Dropdown Equipe */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Equipe Responsável <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowEquipeDropdown(prev => !prev);
                  setShowVendedoresDropdown(false);
                }}
              >
                <Text style={[styles.dropdownText, !equipeNome && styles.placeholder]}>
                  {equipeNome || 'Selecione uma equipe'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>

              {showEquipeDropdown && (
                <View style={[
                  styles.dropdownList,
                  { height: Math.min(equipes.length, VISIBLE_ITEMS) * ITEM_HEIGHT },
                ]}>
                  <ScrollView
                    nestedScrollEnabled
                    bounces={false}
                    showsVerticalScrollIndicator={equipes.length > VISIBLE_ITEMS}
                    keyboardShouldPersistTaps="handled"
                  >
                    {equipes.map(equipe => (
                      <TouchableOpacity
                        key={equipe.cod_equipe}
                        style={[
                          styles.dropdownItem,
                          equipeId === equipe.cod_equipe && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setEquipeId(equipe.cod_equipe);
                          setShowEquipeDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            equipeId === equipe.cod_equipe && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {equipe.nome}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
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
                  setShowEquipeDropdown(false);
                }}
              >
                <Text style={[styles.dropdownText, !vendedoresNomes && styles.placeholder]}>
                  {vendedoresNomes || 'Selecione um ou mais vendedores'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>

              {showVendedoresDropdown && (
                <View style={[
                  styles.dropdownList,
                  { height: Math.min(vendedores.length, VISIBLE_ITEMS) * ITEM_HEIGHT },
                ]}>
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








          </View>
          {isKeyboardVisible && (
            <ItemPriceFooter
              onPress={handleSave}
              loading={saving}
              floating={false}
              text="Adicionar"
              quantidade={quantidade ? parseFloat(quantidade.replace(',','.')) : 0}
              valorUnitario={valorUnitario ? parseFloat(valorUnitario.replace(/\./g, '').replace(',', '.')) : 0}
              desconto={desconto ? parseFloat(desconto.replace(',','.')) : 0}
            />)}

        </ScrollView>
      )}
      

    </KeyboardAvoidingView>

    {!isKeyboardVisible && (
        <ItemPriceFooter
          onPress={handleSave}
          loading={saving}
          floating={true}
          text="Adicionar"
          quantidade={quantidade ? parseFloat(quantidade.replace(',','.')) : 0}
          valorUnitario={valorUnitario ? parseFloat(valorUnitario.replace(/\./g, '').replace(',', '.')) : 0}
          desconto={desconto ? parseFloat(desconto.replace(',','.')) : 0}
        />)}
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
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
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
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  halfField: {
    flex: 1,
  },
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
  dropdownText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
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
  dropdownItemSelected: {
    backgroundColor: '#f5f5f5',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: { backgroundColor: '#666' },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default AddServiceScreen;