// screens/VehicleFormScreen.tsx
import ModalHeader from '@/components/ModalHeader';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isValidPlate } from '../services/ocrService';

interface Vehicle {
  plate: string;
  mileage: string;
}

type RootStackParamList = {
  ServiceForm: undefined;
  ClientSearch: { onSelectClient: (client: any) => void };
  CameraScreen: { onVehicleAdd: (vehicle: Vehicle) => void };
  VehicleForm: {
    plate?: string;
    onVehicleAdd: (vehicle: Vehicle) => void;
  };
};

type VehicleFormScreenProps = NativeStackScreenProps<RootStackParamList, 'VehicleForm'>;

const VehicleFormScreen = ({ navigation, route }: VehicleFormScreenProps) => {
  const { plate: initialPlate, onVehicleAdd } = route.params;
  
  const [plate, setPlate] = useState(initialPlate || '');
  const [mileage, setMileage] = useState('');
  const [plateError, setPlateError] = useState('');

  useEffect(() => {
    if (initialPlate) {
      setPlate(initialPlate);
    }
  }, [initialPlate]);

  const formatPlateInput = (text: string) => {
    // Remove caracteres inválidos e converte para maiúsculas
    let formatted = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Limita a 7 caracteres
    if (formatted.length > 7) {
      formatted = formatted.substring(0, 7);
    }

    // Adiciona hífen automaticamente para formato antigo (ABC1234 -> ABC-1234)
    if (formatted.length > 3) {
      const firstPart = formatted.substring(0, 3);
      const secondPart = formatted.substring(3);
      
      // Verifica se é formato antigo (3 letras + números)
      if (/^[A-Z]{3}$/.test(firstPart) && /^[0-9]+$/.test(secondPart)) {
        formatted = `${firstPart}-${secondPart}`;
      }
    }

    return formatted;
  };

  const handlePlateChange = (text: string) => {
    const formatted = formatPlateInput(text);
    setPlate(formatted);
    setPlateError('');
  };

  const formatMileageInput = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Formata com pontos de milhar
    if (numbers.length === 0) return '';
    
    const numberValue = parseInt(numbers, 10);
    return numberValue.toLocaleString('pt-BR');
  };

  const handleMileageChange = (text: string) => {
    const formatted = formatMileageInput(text);
    setMileage(formatted);
  };

  const validateAndSave = () => {
    // Validar placa
    if (!plate.trim()) {
      setPlateError('A placa é obrigatória');
      return;
    }

    const cleanPlate = plate.replace(/[^A-Z0-9]/g, '');
    if (!isValidPlate(cleanPlate)) {
      setPlateError('Placa inválida. Use formato ABC-1234 ou ABC1D23');
      return;
    }

    // Validar quilometragem
    if (!mileage.trim()) {
      Alert.alert('Atenção', 'A quilometragem é obrigatória');
      return;
    }

    const mileageNumber = parseInt(mileage.replace(/\D/g, ''), 10);
    if (isNaN(mileageNumber) || mileageNumber <= 0) {
      Alert.alert('Atenção', 'Quilometragem inválida');
      return;
    }

    // Retornar dados do veículo
    const vehicle: Vehicle = {
      plate: plate,
      mileage: mileage,
    };

    onVehicleAdd(vehicle);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <ModalHeader
          title="Dados do Veículo"
          onClose={() => navigation.goBack()}
        />

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Campo Placa */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Placa <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.plateInput,
                plateError ? styles.inputError : null,
              ]}
              placeholder="ABC-1234 ou ABC1D23"
              placeholderTextColor="#999"
              value={plate}
              onChangeText={handlePlateChange}
              maxLength={8}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {plateError ? (
              <Text style={styles.errorText}>{plateError}</Text>
            ) : (
              <Text style={styles.helperText}>
                Formato antigo (ABC-1234) ou Mercosul (ABC1D23)
              </Text>
            )}
          </View>

          {/* Campo Quilometragem */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Quilometragem (km) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 50.000"
              placeholderTextColor="#999"
              value={mileage}
              onChangeText={handleMileageChange}
              keyboardType="numeric"
            />
            <Text style={styles.helperText}>
              Informe a quilometragem atual do veículo
            </Text>
          </View>

          {/* Informação sobre a placa capturada */}
          {initialPlate && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ✓ Placa detectada automaticamente
              </Text>
              <Text style={styles.infoSubtext}>
                Você pode editá-la se necessário
              </Text>
            </View>
          )}
        </View>

        {/* Botão Salvar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={validateAndSave}
          >
            <Text style={styles.saveButtonText}>Salvar Veículo</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#ff0000',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  plateInput: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#ff0000',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#558b2f',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default VehicleFormScreen;