// src/screens/ServiceForm.tsx

import ModalHeader from '@/components/ModalHeader';
import SelectField from '@/components/SelectField';
import ClientField from '@/components/service-form/ClientField';
import EditModeBanner from '@/components/service-form/EditModeBanner';
import ImagensSection from '@/components/service-form/ImagensSection';
import ProblemasSection from '@/components/service-form/ProblemasSection';
import ProductsSection from '@/components/service-form/ProductsSection';
import { SaveButtonWithSummary } from '@/components/service-form/Savebuttonwithsummary';
import ServicesSection from '@/components/service-form/ServicesSection';
import { useTheme } from '@/contexts/ThemeContext';
import { useFormData } from '@/contexts/FormDataContext';
import { useServiceForm } from '@/hooks/useServiceForm';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import type { AppColors } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation.types';
import type { ProblemaData } from '@/types/problema.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ServiceFormProps = NativeStackScreenProps<RootStackParamList, 'ServiceForm'>;

const ServiceForm = ({ navigation, route }: ServiceFormProps) => {
  const { order } = route.params || {};
  const { services, removeService, products, removeProduct } = useFormData();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const isKeyboardVisible = useKeyboardVisibility();

  const {
    obs, setObs, saving, isEditMode, selectedClient, selectedVehicle,
    servicesExpanded, setServicesExpanded,
    productsExpanded, setProductsExpanded,
    problemas, problemasExpanded, setProblemasExpanded,
    imagens, imagensExistentes, imagensExpanded, setImagensExpanded, addImagem, removeImagem,
    removeProblema, handleClientSelect, handleAddClient,
    handleVehicleAdd, handleSave,
  } = useServiceForm({ order, navigation });

  const handleAddService = () => { navigation.navigate('AddService'); setServicesExpanded(true); };
  const handleAddProduct = () => { navigation.navigate('AddProduct'); setProductsExpanded(true); };
  const handleAddProblema = () => { navigation.navigate('AddProblema'); setProblemasExpanded(true); };
  const handleEditProblema = (problema: ProblemaData) => navigation.navigate('AddProblema', { problema });

  const saveButtonProps = {
    onPress: handleSave, loading: saving, disabled: saving,
    text: isEditMode ? 'Atualizar' : 'Salvar',
    services, products,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ModalHeader title="Novo Serviço" onClose={() => navigation.goBack()} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: !isKeyboardVisible ? 100 : 0 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {isEditMode && order && <EditModeBanner orderCode={order.cod_ordem} />}
            <ClientField selectedClient={selectedClient} onSelect={handleClientSelect} onAdd={handleAddClient} />
            <SelectField
              label="Veículo" required
              placeholder="Adicionar veículo"
              selectedValue={selectedVehicle?.plate}
              selectedSubtitle={selectedVehicle ? `${selectedVehicle.modelo} - ${selectedVehicle.ano} | ${selectedVehicle.mileage} km` : undefined}
              helperText="Tire uma foto da placa ou digite manualmente"
              onPress={handleVehicleAdd}
            />
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Observações (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Detalhes adicionais, instruções especiais, etc."
                placeholderTextColor={colors.textPlaceholder}
                multiline numberOfLines={2}
                value={obs} onChangeText={setObs}
              />
            </View>
            <ProblemasSection
              problemas={problemas} expanded={problemasExpanded}
              onToggle={setProblemasExpanded} onAdd={handleAddProblema}
              onRemove={removeProblema} onEdit={handleEditProblema}
            />
            <ImagensSection
              imagens={imagens} imagensExistentes={imagensExistentes}
              expanded={imagensExpanded}
              onToggle={setImagensExpanded} onAdd={addImagem} onRemove={removeImagem}
            />
            <ServicesSection
              services={services} expanded={servicesExpanded}
              onToggle={setServicesExpanded} onAdd={handleAddService} onRemove={removeService}
            />
            <ProductsSection
              products={products} expanded={productsExpanded}
              onToggle={setProductsExpanded} onAdd={handleAddProduct} onRemove={removeProduct}
            />
          </View>
          {isKeyboardVisible && <SaveButtonWithSummary {...saveButtonProps} floating={false} />}
        </ScrollView>
      </KeyboardAvoidingView>
      <SaveButtonWithSummary {...saveButtonProps} floating={!isKeyboardVisible} />
    </SafeAreaView>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: colors.background },
    formContainer: { padding: 20 },
    fieldContainer: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8, padding: 16, fontSize: 16,
      color: colors.inputText, borderWidth: 1, borderColor: colors.inputBorder,
    },
    textArea: { height: 120, textAlignVertical: 'top' },
  });

export default ServiceForm;
