import { createVehicle, getVehicleByPlate, updateVehicle } from '@/services/Vehicleservice';
import { isValidPlate } from '@/services/ocrService';
import type { Vehicle, VehicleData } from '@/types/vehicle.types';
import { cleanMileage, cleanPlate } from '@/utils/vehicleFormatters';
import {
    validateMileage,
    validateModel,
    validatePlate,
    validateYear
} from '@/utils/vehicleValidators';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UseVehicleFormProps {
  initialPlate?: string;
  cod_cliente: number;
  onVehicleAdd: (vehicle: Vehicle) => void;
  onClose: () => void;
}

export const useVehicleForm = ({ 
  initialPlate, 
  cod_cliente,
  onVehicleAdd, 
  onClose 
}: UseVehicleFormProps) => {
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
      searchVehicleData(initialPlate);
    }
  }, [initialPlate]);

  const handlePlateChange = (value: string) => {
    setPlate(value);
    setPlateError('');
    setAutoFilled(false);
    setFoundVehicle(null);
    setIsExistingVehicle(false);
  };

  const searchVehicleData = async (plateToSearch?: string) => {
    const searchPlate = plateToSearch || plate;
    
    if (!searchPlate.trim()) {
      Alert.alert('Atenção', 'Digite uma placa para buscar');
      return;
    }

    const clean = cleanPlate(searchPlate);
    if (!isValidPlate(clean)) {
      setPlateError('Placa inválida. Use formato ABC-1234 ou ABC1D23');
      return;
    }

    setSearching(true);
    setPlateError('');

    try {
      const result = await getVehicleByPlate(searchPlate);

      if (result.success && result.data) {
        setFoundVehicle(result.data);
        setIsExistingVehicle(true);
        setModelo(result.data.modelo);
        setAno(result.data.ano);
        setAutoFilled(true);
        
        Alert.alert(
          'Veículo encontrado!',
          `${result.data.modelo} - ${result.data.ano}\n\nEste veículo já está cadastrado. Deseja selecioná-lo ou criar um novo cadastro?`,
          [
            {
              text: 'Selecionar este',
              onPress: () => setIsExistingVehicle(true),
            },
            {
              text: 'Criar novo',
              onPress: () => {
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
      Alert.alert('Erro', 'Ocorreu um erro ao buscar o veículo. Tente novamente.');
    } finally {
      setSearching(false);
    }
  };

  const validateAndSave = async () => {
    // Validar placa
    const plateValidation = validatePlate(plate);
    if (!plateValidation.isValid) {
      setPlateError(plateValidation.error!);
      return;
    }

    // Se for veículo existente
    if (isExistingVehicle && foundVehicle) {
      return handleExistingVehicle();
    }

    // Criar novo veículo
    return handleNewVehicle();
  };

  const handleExistingVehicle = async () => {
    if (!foundVehicle) return;

    if (mileage.trim()) {
      const mileageValidation = validateMileage(mileage, false);
      if (!mileageValidation.isValid) {
        Alert.alert('Atenção', mileageValidation.error);
        return;
      }

      setSaving(true);

      try {
        const mileageNumber = cleanMileage(mileage);
        const result = await updateVehicle({
          cod_veiculo: foundVehicle.cod_veiculo,
          kmatual: mileageNumber,
        });

        if (!result.success) {
          Alert.alert('Erro ao atualizar', result.error || 'Não foi possível atualizar o veículo.');
          setSaving(false);
          return;
        }

        const vehicle: Vehicle = {
          cod_veiculo: foundVehicle.cod_veiculo,
          plate: plate,
          modelo: foundVehicle.modelo,
          ano: foundVehicle.ano,
          mileage: mileage,
        };

        onVehicleAdd(vehicle);
        onClose();
      } catch (error) {
        console.error('Erro ao atualizar veículo:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao atualizar o veículo.');
        setSaving(false);
      }
    } else {
      const vehicle: Vehicle = {
        cod_veiculo: foundVehicle.cod_veiculo,
        plate: plate,
        modelo: foundVehicle.modelo,
        ano: foundVehicle.ano,
        mileage: '0',
      };

      onVehicleAdd(vehicle);
      onClose();
    }
  };

  const handleNewVehicle = async () => {
    // Validações
    const modelValidation = validateModel(modelo);
    if (!modelValidation.isValid) {
      Alert.alert('Atenção', modelValidation.error);
      return;
    }

    const yearValidation = validateYear(ano);
    if (!yearValidation.isValid) {
      Alert.alert('Atenção', yearValidation.error);
      return;
    }

    const mileageValidation = validateMileage(mileage);
    if (!mileageValidation.isValid) {
      Alert.alert('Atenção', mileageValidation.error);
      return;
    }

    setSaving(true);

    try {
      const clean = cleanPlate(plate);
      const mileageNumber = cleanMileage(mileage);

      const result = await createVehicle({
        placa: clean,
        cod_cliente: cod_cliente,
        modelo: modelo.trim(),
        ano: ano,
        kmatual: mileageNumber,
      });

      if (!result.success) {
        Alert.alert('Erro ao cadastrar', result.error || 'Não foi possível cadastrar o veículo.');
        setSaving(false);
        return;
      }

      const vehicle: Vehicle = {
        cod_veiculo: result.data!.cod_veiculo,
        plate: plate,
        modelo: modelo,
        ano: ano,
        mileage: mileage,
      };

      onVehicleAdd(vehicle);
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o veículo.');
      setSaving(false);
    }
  };

  return {
    // State
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
    
    // Handlers
    handlePlateChange,
    setModelo,
    setAno,
    setMileage,
    searchVehicleData,
    validateAndSave,
  };
};