// src/screens/AddServiceScreen.tsx

import { DropdownSelect } from '@/components/DropdownSelect';
import { FormField } from '@/components/FormField';
import { ItemPriceFooter } from '@/components/ItemPriceFooter';
import ModalHeader from '@/components/ModalHeader';
import { QuantityPriceRow } from '@/components/QuantityPriceRow';
import { useTheme } from '@/contexts/ThemeContext';
import { useFormData } from '@/contexts/FormDataContext';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import { useTeamVendorData } from '@/hooks/useTeamVendorData';
import type { AppColors } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation.types';
import { formatCurrency, formatPercentage, parseCurrency, parseQuantity } from '@/utils/formatters';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'AddService'>;

const AddServiceScreen = ({ navigation }: Props) => {
  const { addService } = useFormData();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const isKeyboardVisible = useKeyboardVisibility();
  const { equipes, vendedores, isLoading } = useTeamVendorData();

  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [valorUnitario, setValorUnitario] = useState('');
  const [desconto, setDesconto] = useState('');
  const [equipeId, setEquipeId] = useState<number | null>(null);
  const [vendedoresSelecionados, setVendedoresSelecionados] = useState<number[]>([]);
  const [saving] = useState(false);
  const [showEquipeDropdown, setShowEquipeDropdown] = useState(false);
  const [showVendedoresDropdown, setShowVendedoresDropdown] = useState(false);

  const toggleVendedor = (id: number) =>
    setVendedoresSelecionados(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);

  const handleSelectEquipe = (id: number) => { setEquipeId(id); setShowEquipeDropdown(false); };

  const handleSave = () => {
    if (!descricao.trim()) { Alert.alert('Atenção', 'Por favor, preencha a descrição do serviço'); return; }
    if (!quantidade.trim() || parseQuantity(quantidade) <= 0) { Alert.alert('Atenção', 'Por favor, preencha uma quantidade válida'); return; }
    if (!valorUnitario.trim()) { Alert.alert('Atenção', 'Por favor, preencha o valor unitário'); return; }
    if (!equipeId) { Alert.alert('Atenção', 'Por favor, selecione uma equipe'); return; }
    if (vendedoresSelecionados.length === 0) { Alert.alert('Atenção', 'Por favor, selecione pelo menos um vendedor'); return; }

    const equipe = equipes.find(e => e.cod_equipe === equipeId);
    const vendedoresFiltrados = vendedores.filter(v => vendedoresSelecionados.includes(v.cod_vendedor));

    addService({
      id: Date.now().toString(),
      descricao,
      quantidade: parseQuantity(quantidade),
      valorUnitario: parseCurrency(valorUnitario),
      desconto: desconto ? parseQuantity(desconto) : 0,
      cod_equipe: equipeId,
      equipe: equipe?.nome || '',
      cod_vendedores: vendedoresSelecionados,
      vendedores: vendedoresFiltrados.map(v => v.nome),
    });
    navigation.goBack();
  };

  const equipeNome = equipeId ? equipes.find(e => e.cod_equipe === equipeId)?.nome ?? '' : '';
  const vendedoresNomes = vendedores
    .filter(v => vendedoresSelecionados.includes(v.cod_vendedor))
    .map(v => v.nome).join(', ');

  const footerProps = {
    onPress: handleSave, loading: saving, text: 'Adicionar',
    quantidade: parseQuantity(quantidade),
    valorUnitario: parseCurrency(valorUnitario),
    desconto: desconto ? parseQuantity(desconto) : 0,
  };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ModalHeader title="Adicionar Serviço" onClose={() => navigation.goBack()} />
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
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
              <FormField label="Descrição" required>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: Mão de obra"
                  placeholderTextColor={colors.textPlaceholder}
                  value={descricao}
                  onChangeText={setDescricao}
                />
              </FormField>
              <QuantityPriceRow
                quantidade={quantidade} onQuantidadeChange={setQuantidade}
                valorUnitario={valorUnitario}
                onValorUnitarioChange={value => setValorUnitario(formatCurrency(value))}
                quantidadeLabel="Quantidade (horas)"
              />
              <FormField label="Desconto (%)">
                <TextInput
                  style={styles.input} placeholder="0"
                  placeholderTextColor={colors.textPlaceholder}
                  keyboardType="decimal-pad" value={desconto}
                  onChangeText={value => setDesconto(formatPercentage(value))}
                  maxLength={6}
                />
              </FormField>
              <DropdownSelect
                label="Equipe Responsável" required
                placeholder="Selecione uma equipe"
                displayValue={equipeNome}
                items={equipes.map(e => ({ id: e.cod_equipe, label: e.nome }))}
                mode="single" selectedIds={equipeId ? [equipeId] : []}
                onSelect={handleSelectEquipe}
                isOpen={showEquipeDropdown}
                onToggle={() => { setShowEquipeDropdown(prev => !prev); setShowVendedoresDropdown(false); }}
              />
              <DropdownSelect
                label="Vendedor(es)" required
                placeholder="Selecione um ou mais vendedores"
                displayValue={vendedoresNomes}
                items={vendedores.map(v => ({ id: v.cod_vendedor, label: v.nome }))}
                mode="multi" selectedIds={vendedoresSelecionados}
                onSelect={toggleVendedor}
                isOpen={showVendedoresDropdown}
                onToggle={() => { setShowVendedoresDropdown(prev => !prev); setShowEquipeDropdown(false); }}
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

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, backgroundColor: colors.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 16, color: colors.textSecondary },
    formContainer: { padding: 20 },
    input: {
      backgroundColor: colors.inputBackground, borderRadius: 8, padding: 16,
      fontSize: 16, color: colors.inputText, borderWidth: 1, borderColor: colors.inputBorder,
    },
  });

export default AddServiceScreen;
