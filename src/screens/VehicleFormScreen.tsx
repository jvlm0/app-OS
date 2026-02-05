// screens/VehicleFormScreen.tsx
import ModalHeader from '@/components/ModalHeader';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isValidPlate } from '../services/ocrService';
import { createVehicle, getVehicleByPlate, updateVehicle } from '../services/Vehicleservice';
import type { RootStackParamList } from '../types/navigation.types';
import type { Vehicle, VehicleData } from '../types/vehicle.types';

type VehicleFormScreenProps = NativeStackScreenProps<RootStackParamList, 'VehicleForm'>;

const VehicleFormScreen = ({ navigation, route }: VehicleFormScreenProps) => {
  const { plate: initialPlate, cod_cliente, onVehicleAdd } = route.params;
  
  const [plate, setPlate] = useState(initialPlate || '');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [mileage, setMileage] = useState('');
  const [plateError, setPlateError] = useState('');
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [foundVehicle, setFoundVehicle] = useState<VehicleData | null>(null);
  const [isExistingVehicle, setIsExistingVehicle] = useState(false);

  useEffect(() => {
    if (initialPlate) {
      setPlate(initialPlate);
      // Busca automática quando vem da câmera
      searchVehicleData(initialPlate);
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
    setAutoFilled(false);
    setFoundVehicle(null);
    setIsExistingVehicle(false);
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

  const searchVehicleData = async (plateToSearch?: string) => {
    const searchPlate = plateToSearch || plate;
    
    if (!searchPlate.trim()) {
      Alert.alert('Atenção', 'Digite uma placa para buscar');
      return;
    }

    const cleanPlate = searchPlate.replace(/[^A-Z0-9]/g, '');
    if (!isValidPlate(cleanPlate)) {
      setPlateError('Placa inválida. Use formato ABC-1234 ou ABC1D23');
      return;
    }

    setSearching(true);
    setPlateError('');

    try {
      const result = await getVehicleByPlate(searchPlate);

      if (result.success && result.data) {
        // Armazena o veículo encontrado
        setFoundVehicle(result.data);
        setIsExistingVehicle(true);
        
        // Preenche os campos com os dados encontrados
        setModelo(result.data.modelo);
        setAno(result.data.ano);
        setAutoFilled(true);
        
        // Mostra opções: selecionar ou criar novo
        Alert.alert(
          'Veículo encontrado!',
          `${result.data.modelo} - ${result.data.ano}\n\nEste veículo já está cadastrado. Deseja selecioná-lo ou criar um novo cadastro?`,
          [
            {
              text: 'Selecionar este',
              onPress: () => {
                // Mantém como seleção do veículo existente
                setIsExistingVehicle(true);
              },
            },
            {
              text: 'Criar novo',
              onPress: () => {
                // Limpa os campos para criar novo
                setFoundVehicle(null);
                setIsExistingVehicle(false);
                setModelo('');
                setAno('');
                setMileage('');
                setAutoFilled(false);
                Alert.alert(
                  'Criar novo veículo',
                  'Preencha os dados do novo veículo com esta placa.',
                  [{ text: 'OK' }]
                );
              },
            },
          ]
        );
      } else {
        setFoundVehicle(null);
        setIsExistingVehicle(false);
        Alert.alert(
          'Veículo não encontrado',
          result.error || 'Este veículo não está cadastrado na base de dados. Você pode preencher os dados manualmente.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao buscar o veículo. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setSearching(false);
    }
  };

  const validateAndSave = async () => {
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

    // Se for veículo existente, apenas atualiza a quilometragem se foi alterada
    if (isExistingVehicle && foundVehicle) {
      // Validar quilometragem se foi preenchida
      if (mileage.trim()) {
        const mileageNumber = parseInt(mileage.replace(/\D/g, ''), 10);
        if (isNaN(mileageNumber) || mileageNumber < 0) {
          Alert.alert('Atenção', 'Quilometragem inválida');
          return;
        }

        // Atualiza apenas a quilometragem
        setSaving(true);

        try {
          const result = await updateVehicle({
            cod_veiculo: foundVehicle.cod_veiculo,
            kmatual: mileageNumber,
          });

          if (!result.success) {
            Alert.alert(
              'Erro ao atualizar',
              result.error || 'Não foi possível atualizar o veículo. Tente novamente.',
              [{ text: 'OK' }]
            );
            setSaving(false);
            return;
          }

          // Sucesso! Retorna o veículo selecionado
          const vehicle: Vehicle = {
            cod_veiculo: foundVehicle.cod_veiculo,
            plate: plate,
            modelo: foundVehicle.modelo,
            ano: foundVehicle.ano,
            mileage: mileage,
          };

          onVehicleAdd(vehicle);
          navigation.goBack();
        } catch (error) {
          console.error('Erro ao atualizar veículo:', error);
          Alert.alert(
            'Erro',
            'Ocorreu um erro ao atualizar o veículo. Tente novamente.',
            [{ text: 'OK' }]
          );
          setSaving(false);
        }
      } else {
        // Sem quilometragem, apenas retorna o veículo sem atualizar
        const vehicle: Vehicle = {
          cod_veiculo: foundVehicle.cod_veiculo,
          plate: plate,
          modelo: foundVehicle.modelo,
          ano: foundVehicle.ano,
          mileage: '0',
        };

        onVehicleAdd(vehicle);
        navigation.goBack();
      }
      return;
    }

    // Criar novo veículo - validações completas
    // Validar modelo
    if (!modelo.trim()) {
      Alert.alert('Atenção', 'O modelo é obrigatório');
      return;
    }

    // Validar ano
    if (!ano.trim()) {
      Alert.alert('Atenção', 'O ano é obrigatório');
      return;
    }

    const anoNumber = parseInt(ano, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(anoNumber) || anoNumber < 1900 || anoNumber > currentYear + 1) {
      Alert.alert('Atenção', 'Ano inválido');
      return;
    }

    // Validar quilometragem
    if (!mileage.trim()) {
      Alert.alert('Atenção', 'A quilometragem é obrigatória');
      return;
    }

    const mileageNumber = parseInt(mileage.replace(/\D/g, ''), 10);
    if (isNaN(mileageNumber) || mileageNumber < 0) {
      Alert.alert('Atenção', 'Quilometragem inválida');
      return;
    }

    // Cadastrar veículo na API
    setSaving(true);

    try {
      const result = await createVehicle({
        placa: cleanPlate,
        cod_cliente: cod_cliente,
        modelo: modelo.trim(),
        ano: ano,
        kmatual: mileageNumber,
      });

      if (!result.success) {
        Alert.alert(
          'Erro ao cadastrar',
          result.error || 'Não foi possível cadastrar o veículo. Tente novamente.',
          [{ text: 'OK' }]
        );
        setSaving(false);
        return;
      }

      // Sucesso! Retornar dados do veículo para o ServiceForm
      const vehicle: Vehicle = {
        cod_veiculo: result.data!.cod_veiculo,
        plate: plate,
        modelo: modelo,
        ano: ano,
        mileage: mileage,
      };

      onVehicleAdd(vehicle);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao cadastrar o veículo. Tente novamente.',
        [{ text: 'OK' }]
      );
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <ModalHeader
          title={isExistingVehicle ? 'Selecionar Veículo' : 'Dados do Veículo'}
          onClose={() => navigation.goBack()}
        />
        <ScrollView style={styles.scrollView}>
        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Campo Placa com Botão de Busca */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Placa <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.plateInputContainer}>
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
                editable={!searching && !saving}
              />
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  (searching || saving) && styles.searchButtonDisabled,
                ]}
                onPress={() => searchVehicleData()}
                disabled={searching || saving}
              >
                {searching ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Search size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
            {plateError ? (
              <Text style={styles.errorText}>{plateError}</Text>
            ) : (
              <Text style={styles.helperText}>
                Formato antigo (ABC-1234) ou Mercosul (ABC1D23)
              </Text>
            )}
          </View>

          {/* Campo Modelo */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Modelo {!isExistingVehicle && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={[
                styles.input,
                isExistingVehicle && styles.inputDisabled,
              ]}
              placeholder="Ex: KICKS, CIVIC, GOL"
              placeholderTextColor="#999"
              value={modelo}
              onChangeText={setModelo}
              autoCapitalize="characters"
              editable={!searching && !saving && !isExistingVehicle}
            />
            {isExistingVehicle && (
              <Text style={styles.helperText}>
                Campo não editável para veículo existente
              </Text>
            )}
          </View>

          {/* Campo Ano */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Ano {!isExistingVehicle && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={[
                styles.input,
                isExistingVehicle && styles.inputDisabled,
              ]}
              placeholder="Ex: 2020"
              placeholderTextColor="#999"
              value={ano}
              onChangeText={setAno}
              keyboardType="numeric"
              maxLength={4}
              editable={!searching && !saving && !isExistingVehicle}
            />
            {isExistingVehicle && (
              <Text style={styles.helperText}>
                Campo não editável para veículo existente
              </Text>
            )}
          </View>

          {/* Campo Quilometragem */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Quilometragem (km) {!isExistingVehicle && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 50.000"
              placeholderTextColor="#999"
              value={mileage}
              onChangeText={handleMileageChange}
              keyboardType="numeric"
              editable={!searching && !saving}
            />
            <Text style={styles.helperText}>
              {isExistingVehicle 
                ? 'Opcional: Informe para atualizar a quilometragem atual'
                : 'Informe a quilometragem atual do veículo'}
            </Text>
          </View>

          {/* Informação sobre a placa capturada */}
          {initialPlate && !isExistingVehicle && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ✓ Placa detectada automaticamente
              </Text>
              <Text style={styles.infoSubtext}>
                Você pode editá-la se necessário
              </Text>
            </View>
          )}

          {/* Informação sobre veículo encontrado */}
          {isExistingVehicle && foundVehicle && (
            <View style={[styles.infoBox, styles.successBox]}>
              <Text style={styles.infoText}>
                ✓ Veículo encontrado na base de dados
              </Text>
              <Text style={styles.infoSubtext}>
                Modelo e ano não podem ser editados. Você pode atualizar apenas a quilometragem.
              </Text>
            </View>
          )}

          {/* Informação sobre dados preenchidos automaticamente */}
          {autoFilled && !isExistingVehicle && (
            <View style={[styles.infoBox, styles.warningBox]}>
              <Text style={styles.infoText}>
                ⚠ Criando novo cadastro
              </Text>
              <Text style={styles.infoSubtext}>
                Você optou por criar um novo veículo com esta placa. Preencha todos os dados.
              </Text>
            </View>
          )}
        </View>
        </ScrollView>

        {/* Botão Salvar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, (searching || saving) && styles.saveButtonDisabled]}
            onPress={validateAndSave}
            disabled={searching || saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isExistingVehicle ? 'Selecionar Veículo' : 'Salvar Veículo'}
              </Text>
            )}
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
  scrollView: {
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
  inputDisabled: {
    backgroundColor: '#e8e8e8',
    color: '#666',
  },
  plateInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  plateInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#666',
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
    marginTop: 8,
  },
  successBox: {
    backgroundColor: '#e3f2fd',
    borderLeftColor: '#2196f3',
  },
  warningBox: {
    backgroundColor: '#fff3e0',
    borderLeftColor: '#ff9800',
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
  saveButtonDisabled: {
    backgroundColor: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default VehicleFormScreen;