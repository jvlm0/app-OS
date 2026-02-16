// src/screens/AddServiceScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import { useFormData } from '@/contexts/FormDataContext';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
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

type AddServiceScreenProps = NativeStackScreenProps<RootStackParamList, 'AddService'>;

// Mock data - substituir por dados reais da API
const EQUIPES = [
  { id: 1, nome: 'Equipe A' },
  { id: 2, nome: 'Equipe B' },
  { id: 3, nome: 'Equipe C' },
];

const VENDEDORES = [
  { id: 1, nome: 'João Silva' },
  { id: 2, nome: 'Maria Santos' },
  { id: 3, nome: 'Pedro Oliveira' },
  { id: 4, nome: 'Ana Costa' },
];

const AddServiceScreen = ({ navigation }: AddServiceScreenProps) => {
  const insets = useSafeAreaInsets();
  const { addService } = useFormData();
  
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [desconto, setDesconto] = useState('');
  const [equipeId, setEquipeId] = useState<number | null>(null);
  const [vendedoresSelecionados, setVendedoresSelecionados] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  
  const [showEquipeDropdown, setShowEquipeDropdown] = useState(false);
  const [showVendedoresDropdown, setShowVendedoresDropdown] = useState(false);

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
    setVendedoresSelecionados(prev => {
      if (prev.includes(id)) {
        return prev.filter(v => v !== id);
      }
      return [...prev, id];
    });
  };

  const handleSave = () => {
    if (!descricao.trim()) {
      alert('Por favor, preencha a descrição do serviço');
      return;
    }
    
    if (!quantidade.trim() || parseFloat(quantidade) <= 0) {
      alert('Por favor, preencha uma quantidade válida');
      return;
    }
    
    if (!valorUnitario.trim()) {
      alert('Por favor, preencha o valor unitário');
      return;
    }
    
    if (!equipeId) {
      alert('Por favor, selecione uma equipe');
      return;
    }
    
    if (vendedoresSelecionados.length === 0) {
      alert('Por favor, selecione pelo menos um vendedor');
      return;
    }

    const equipe = EQUIPES.find(e => e.id === equipeId);
    const vendedores = VENDEDORES.filter(v => vendedoresSelecionados.includes(v.id));
    
    const serviceData = {
      id: Date.now().toString(),
      descricao,
      quantidade: parseFloat(quantidade),
      valorUnitario: parseFloat(valorUnitario.replace(/\./g, '').replace(',', '.')),
      desconto: desconto ? parseFloat(desconto) : 0,
      equipe: equipe?.nome || '',
      vendedores: vendedores.map(v => v.nome),
    };
    
    // Adiciona o serviço através do contexto
    addService(serviceData);
    navigation.goBack();
  };

  const equipeNome = equipeId ? EQUIPES.find(e => e.id === equipeId)?.nome : '';
  const vendedoresNomes = VENDEDORES
    .filter(v => vendedoresSelecionados.includes(v.id))
    .map(v => v.nome)
    .join(', ');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ModalHeader
        title="Adicionar Serviço"
        onClose={() => navigation.goBack()}
        insetsTop={insets.top}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
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

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Equipe Responsável <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowEquipeDropdown(!showEquipeDropdown)}
            >
              <Text style={[styles.dropdownText, !equipeNome && styles.placeholder]}>
                {equipeNome || 'Selecione uma equipe'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            
            {showEquipeDropdown && (
              <View style={styles.dropdownList}>
                {EQUIPES.map(equipe => (
                  <TouchableOpacity
                    key={equipe.id}
                    style={[
                      styles.dropdownItem,
                      equipeId === equipe.id && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setEquipeId(equipe.id);
                      setShowEquipeDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        equipeId === equipe.id && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {equipe.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Vendedor(es) <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowVendedoresDropdown(!showVendedoresDropdown)}
            >
              <Text style={[styles.dropdownText, !vendedoresNomes && styles.placeholder]}>
                {vendedoresNomes || 'Selecione um ou mais vendedores'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            
            {showVendedoresDropdown && (
              <View style={styles.dropdownList}>
                {VENDEDORES.map(vendedor => {
                  const isSelected = vendedoresSelecionados.includes(vendedor.id);
                  return (
                    <TouchableOpacity
                      key={vendedor.id}
                      style={[
                        styles.dropdownItem,
                        isSelected && styles.dropdownItemSelected,
                      ]}
                      onPress={() => toggleVendedor(vendedor.id)}
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
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, saving && styles.submitButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Adicionar Serviço</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },
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
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
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