import ModalHeader from '@/components/ModalHeader';
import { SaveButton } from '@/components/client-form/SaveButton';
import { FormField } from '@/components/form/FormField';
import { MileageInput } from '@/components/vehicle-form/MileageInput';
import { PlateInput } from '@/components/vehicle-form/PlateInput';
import { VehicleInfoBox } from '@/components/vehicle-form/VehicleInfoBox';
import { VehicleModelInput } from '@/components/vehicle-form/VehicleModelInput';
import { VehicleYearInput } from '@/components/vehicle-form/VehicleYearInput';
import { useFormData } from '@/contexts/FormDataContext';
import { useVehicleForm } from '@/hooks/useVehicleForm';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../types/navigation.types';

type VehicleFormScreenProps = NativeStackScreenProps<RootStackParamList, 'VehicleForm'>;

const VehicleFormScreen = ({ navigation, route }: VehicleFormScreenProps) => {
  const { plate: initialPlate, cod_cliente } = route.params;
  
  // ✅ Usar context ao invés de callback
  const { setSelectedVehicle } = useFormData();

  const {
    plate,
    modelo,
    ano,
    mileage,
    plateError,
    searching,
    saving,
    autoFilled,
    foundVehicle,
    isExistingVehicle,
    handlePlateChange,
    setModelo,
    setAno,
    setMileage,
    searchVehicleData,
    validateAndSave,
  } = useVehicleForm({
    initialPlate,
    cod_cliente,
    onVehicleAdd: (vehicle) => {
      setSelectedVehicle(vehicle); // ✅ Atualiza context
    },
    onClose: () => navigation.goBack(),
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ModalHeader
          title={isExistingVehicle ? 'Selecionar Veículo' : 'Dados do Veículo'}
          onClose={() => navigation.goBack()}
        />

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <FormField
              label="Placa"
              required
              helperText={
                plateError || 'Formato antigo (ABC-1234) ou Mercosul (ABC1D23)'
              }
            >
              <PlateInput
                value={plate}
                onChange={handlePlateChange}
                onSearch={() => searchVehicleData()}
                disabled={searching || saving}
                searching={searching}
                hasError={!!plateError}
              />
            </FormField>

            <FormField
              label="Modelo"
              required={!isExistingVehicle}
              helperText={
                isExistingVehicle
                  ? 'Campo não editável para veículo existente'
                  : undefined
              }
            >
              <VehicleModelInput
                value={modelo}
                onChange={setModelo}
                disabled={searching || saving}
                readOnly={isExistingVehicle}
              />
            </FormField>

            <FormField
              label="Ano"
              required={!isExistingVehicle}
              helperText={
                isExistingVehicle
                  ? 'Campo não editável para veículo existente'
                  : undefined
              }
            >
              <VehicleYearInput
                value={ano}
                onChange={setAno}
                disabled={searching || saving}
                readOnly={isExistingVehicle}
              />
            </FormField>

            <FormField
              label="Quilometragem (km)"
              required={!isExistingVehicle}
              helperText={
                isExistingVehicle
                  ? 'Opcional: Informe para atualizar a quilometragem atual'
                  : 'Informe a quilometragem atual do veículo'
              }
            >
              <MileageInput
                value={mileage}
                onChange={setMileage}
                disabled={searching || saving}
              />
            </FormField>

            {initialPlate && !isExistingVehicle && (
              <VehicleInfoBox
                type="info"
                title="✓ Placa detectada automaticamente"
                message="Você pode editá-la se necessário"
              />
            )}

            {isExistingVehicle && foundVehicle && (
              <VehicleInfoBox
                type="success"
                title="✓ Veículo encontrado na base de dados"
                message="Modelo e ano não podem ser editados. Você pode atualizar apenas a quilometragem."
              />
            )}

            {autoFilled && !isExistingVehicle && (
              <VehicleInfoBox
                type="warning"
                title="⚠ Criando novo cadastro"
                message="Você optou por criar um novo veículo com esta placa. Preencha todos os dados."
              />
            )}
          </View>
        </ScrollView>

        <SaveButton
          onPress={validateAndSave}
          loading={saving}
          disabled={searching}
          text={isExistingVehicle ? 'Selecionar Veículo' : 'Salvar Veículo'}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  formContainer: { padding: 20 },
});

export default VehicleFormScreen;