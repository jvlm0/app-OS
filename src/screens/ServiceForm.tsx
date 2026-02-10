import ModalHeader from '@/components/ModalHeader';
import SelectField from '@/components/SelectField';
import ClientField from '@/components/service-form/ClientField';
import DetailsSection from '@/components/service-form/DetailsSection';
import EditModeBanner from '@/components/service-form/EditModeBanner';
import ServicesSection from '@/components/service-form/ServicesSection';
import { useServiceForm } from '@/hooks/useServiceForm';
import type { RootStackParamList } from '@/types/navigation.types';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type ServiceFormProps = NativeStackScreenProps<RootStackParamList, 'ServiceForm'>;

const ServiceForm = ({ navigation, route }: ServiceFormProps) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { order } = route.params || {};

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Reseta o estado do teclado ao voltar para esta tela
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
    title,
    setTitle,
    description,
    setDescription,
    saving,
    isEditMode,
    selectedClient,
    selectedVehicle,
    services,
    servicesExpanded,
    setServicesExpanded,
    detailsExpanded,
    setDetailsExpanded,
    addService,
    removeService,
    updateService,
    formatCurrency,
    handleClientSelect,
    handleAddClient,
    handleVehicleAdd,
    handleSave,
  } = useServiceForm({ order, navigation });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled={isKeyboardVisible}
      style={styles.flex}
    >
      <ModalHeader
        title="Novo Serviço"
        onClose={() => navigation.goBack()}
        insetsTop={insets.top}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
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
            onAdd={addService}
            onRemove={removeService}
            onUpdate={updateService}
            formatCurrency={formatCurrency}
          />

          {/* Detalhes */}
          <DetailsSection
            expanded={detailsExpanded}
            onToggle={setDetailsExpanded}
          />

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, saving && styles.submitButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditMode ? 'Atualizar' : 'Salvar'}
              </Text>
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