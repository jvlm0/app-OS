// src/screens/ServiceForm.tsx

import { SaveButton } from '@/components/client-form/SaveButton';
import ModalHeader from '@/components/ModalHeader';
import SelectField from '@/components/SelectField';
import ClientField from '@/components/service-form/ClientField';
import DetailsSection from '@/components/service-form/DetailsSection';
import EditModeBanner from '@/components/service-form/EditModeBanner';
import ServicesSection from '@/components/service-form/ServicesSection';
import { useFormData } from '@/contexts/FormDataContext';
import { useServiceForm } from '@/hooks/useServiceForm';
import type { RootStackParamList } from '@/types/navigation.types';
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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



type ServiceFormProps = NativeStackScreenProps<RootStackParamList, 'ServiceForm'>;

const ServiceForm = ({ navigation, route }: ServiceFormProps) => {
  const isFocused = useIsFocused();
  const { order } = route.params || {};
  const { services, removeService } = useFormData();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    if (!isFocused) return;

    Keyboard.dismiss();
    setIsKeyboardVisible(false);

    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isFocused]);

  const {
    title,
    setTitle,
    description,
    setDescription,
    saving,
    isEditMode,
    selectedClient,
    selectedVehicle,
    servicesExpanded,
    setServicesExpanded,
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



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} >
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

            {/* Título */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Título <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Manutenção de ar condicionado"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>

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
              <Text style={styles.label}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Detalhes adicionais, instruções especiais, etc."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Serviços */}
            <ServicesSection
              services={services}
              expanded={servicesExpanded}
              onToggle={setServicesExpanded}
              onAdd={handleAddService}
              onRemove={removeService}
            />

            {/* Detalhes */}
            <DetailsSection
              expanded={detailsExpanded}
              onToggle={setDetailsExpanded}
            />


          </View>

          {isKeyboardVisible && (
            <SaveButton
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              text={isEditMode ? 'Atualizar' : 'Salvar'}
              floating={false}
            />
          )}

        </ScrollView>

        

        

      </KeyboardAvoidingView>


          {!isKeyboardVisible && (
          <SaveButton
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            text={isEditMode ? 'Atualizar' : 'Salvar'}
          />
        )}

        

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

export default ServiceForm;