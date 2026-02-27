// src/screens/ServiceForm.tsx

import ModalHeader from '@/components/ModalHeader';
import SelectField from '@/components/SelectField';
import ClientField from '@/components/service-form/ClientField';
import EditModeBanner from '@/components/service-form/EditModeBanner';
import ProblemasSection from '@/components/service-form/ProblemasSection';
import ProductsSection from '@/components/service-form/ProductsSection';
import { SaveButtonWithSummary } from '@/components/service-form/Savebuttonwithsummary';
import ServicesSection from '@/components/service-form/ServicesSection';
import { useFormData } from '@/contexts/FormDataContext';
import { useServiceForm } from '@/hooks/useServiceForm';
import type { RootStackParamList } from '@/types/navigation.types';
import type { ProblemaData } from '@/types/problema.types';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ServiceFormProps = NativeStackScreenProps<RootStackParamList, 'ServiceForm'>;

const ServiceForm = ({ navigation, route }: ServiceFormProps) => {
  const isFocused = useIsFocused();
  const { order } = route.params || {};
  const { services, removeService, products, removeProduct } = useFormData();

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

  const {
    obs,
    setObs,
    saving,
    isEditMode,
    selectedClient,
    selectedVehicle,
    servicesExpanded,
    setServicesExpanded,
    productsExpanded,
    setProductsExpanded,
    problemas,
    problemasExpanded,
    setProblemasExpanded,
    removeProblema,
    detailsExpanded,
    setDetailsExpanded,
    handleClientSelect,
    handleAddClient,
    handleVehicleAdd,
    handleSave,
  } = useServiceForm({ order, navigation });

  const handleAddService = () => {
    navigation.navigate('AddService');
    setServicesExpanded(true);
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
    setProductsExpanded(true);
  };

  const handleAddProblema = () => {
    navigation.navigate('AddProblema');
    setProblemasExpanded(true);
  };

  const handleEditProblema = (problema: ProblemaData) => {
    navigation.navigate('AddProblema', { problema });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ModalHeader
          title="Novo Serviço"
          onClose={() => navigation.goBack()}
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: !isKeyboardVisible ? 100 : 0 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {isEditMode && order && <EditModeBanner orderCode={order.cod_ordem} />}

            

            {/* Cliente */}
            <ClientField
              selectedClient={selectedClient}
              onSelect={handleClientSelect}
              onAdd={handleAddClient}
            />

            {/* Veículo */}
            <SelectField
              label="Veículo"
              required
              placeholder="Adicionar veículo"
              selectedValue={selectedVehicle?.plate}
              selectedSubtitle={
                selectedVehicle
                  ? `${selectedVehicle.modelo} - ${selectedVehicle.ano} | ${selectedVehicle.mileage} km`
                  : undefined
              }
              helperText="Tire uma foto da placa ou digite manualmente"
              onPress={handleVehicleAdd}
            />

            {/* Descrição */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Observações (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Detalhes adicionais, instruções especiais, etc."
                placeholderTextColor="#999"
                multiline
                numberOfLines={2}
                value={obs}
                onChangeText={setObs}
              />
            </View>

            {/* Problemas Relatados */}
            <ProblemasSection
              problemas={problemas}
              expanded={problemasExpanded}
              onToggle={setProblemasExpanded}
              onAdd={handleAddProblema}
              onRemove={removeProblema}
              onEdit={handleEditProblema}
            />

            {/* Serviços */}
            <ServicesSection
              services={services}
              expanded={servicesExpanded}
              onToggle={setServicesExpanded}
              onAdd={handleAddService}
              onRemove={removeService}
            />

            {/* Produtos */}
            <ProductsSection
              products={products}
              expanded={productsExpanded}
              onToggle={setProductsExpanded}
              onAdd={handleAddProduct}
              onRemove={removeProduct}
            />

            {/* Detalhes 
            <DetailsSection
              expanded={detailsExpanded}
              onToggle={setDetailsExpanded}
            />*/}
          </View>

          {isKeyboardVisible && (
            <SaveButtonWithSummary
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              text={isEditMode ? 'Atualizar' : 'Salvar'}
              floating={false}
              services={services}
              products={products}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <SaveButtonWithSummary
        onPress={handleSave}
        loading={saving}
        disabled={saving}
        text={isEditMode ? 'Atualizar' : 'Salvar'}
        floating={!isKeyboardVisible}
        services={services}
        products={products}
      />
    </SafeAreaView>
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
  textArea: { height: 120, textAlignVertical: 'top' },
});

export default ServiceForm;