import { ServiceData } from '@/components/service-form/ReadOnlyServiceCard';
import { useFormData } from '@/contexts/FormDataContext';
import { createOrder, updateOrder } from '@/services/orderService';
import type { RootStackParamList } from '@/types/navigation.types';
import type { Order } from '@/types/order-list.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface Service {
  id: string;
  description: string;
  quantity: string;
  unitValue: string;
}

interface UseServiceFormProps {
  order?: Order;
  navigation: NativeStackNavigationProp<RootStackParamList, 'ServiceForm'>;
}

export const useServiceForm = ({ order, navigation }: UseServiceFormProps) => {
  const {
    selectedClient,
    selectedVehicle,
    setSelectedClient,
    setSelectedVehicle,
    clearFormData,
  } = useFormData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState<ServiceData[]>([]);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  // Inicialização / limpeza ao montar e desmontar
  useEffect(() => {
    clearFormData();

    if (order) {
      setIsEditMode(true);
      setTitle(order.titulo);
      setDescription(order.descricao || '');

      setSelectedClient({
        COD_PESSOA: order.cliente.COD_PESSOA,
        nome: order.cliente.nome,
        telefone: order.cliente.telefone,
        cpfcnpj: order.cliente.cpfcnpj,
      });

      setSelectedVehicle({
        cod_veiculo: order.veiculo.cod_veiculo,
        plate: order.veiculo.placa,
        modelo: order.veiculo.modelo,
        ano: order.veiculo.ano,
        mileage: order.veiculo.kmatual != null ? order.veiculo.kmatual.toString() : '',
      });
    } else {
      setIsEditMode(false);
      setTitle('');
      setDescription('');
      setServices([]);
    }

    return () => {
      clearFormData();
    };
  }, [order]);

  // ─── Navegação ────────────────────────────────────────────────────────────

  const handleClientSelect = () => navigation.navigate('ClientSearch');

  const handleAddClient = () => navigation.navigate('ClientForm');

  const handleVehicleAdd = () => {
    if (!selectedClient) {
      Alert.alert('Atenção', 'Selecione um cliente antes de adicionar um veículo', [
        { text: 'OK' },
      ]);
      return;
    }
    navigation.navigate('CameraScreen', { cod_cliente: selectedClient.COD_PESSOA });
  };

  // ─── Serviços ─────────────────────────────────────────────────────────────

  

  const removeService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateService = (id: string, field: keyof Service, value: string) =>
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  // ─── Validação ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'O título é obrigatório');
      return false;
    }
    if (!selectedClient) {
      Alert.alert('Atenção', 'Selecione um cliente');
      return false;
    }
    if (!selectedVehicle) {
      Alert.alert('Atenção', 'Adicione um veículo');
      return false;
    }
    if (!selectedVehicle.cod_veiculo) {
      Alert.alert(
        'Erro',
        'O veículo não possui um código válido. Por favor, cadastre o veículo novamente.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);

    try {
      if (isEditMode && order) {
        await handleUpdate(order.cod_ordem);
      } else {
        await handleCreate();
      }
    } catch (error) {
      console.error('Erro ao salvar ordem:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a ordem de serviço. Tente novamente.', [
        { text: 'OK' },
      ]);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (cod_ordem: number) => {
    const result = await updateOrder({
      cod_ordem,
      titulo: title.trim(),
      descricao: description.trim() || '',
      cod_veiculo: selectedVehicle!.cod_veiculo!,
      cod_cliente: selectedClient!.COD_PESSOA,
    });

    if (!result.success) {
      Alert.alert(
        'Erro ao atualizar',
        result.error || 'Não foi possível atualizar a ordem de serviço. Tente novamente.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert('Sucesso!', `Ordem de serviço #${cod_ordem} atualizada com sucesso!`, [
      { text: 'OK', onPress: () => { clearFormData(); navigation.goBack(); } },
    ]);
  };

  const handleCreate = async () => {
    const result = await createOrder({
      titulo: title.trim(),
      descricao: description.trim() || '',
      cod_veiculo: selectedVehicle!.cod_veiculo!,
      cod_cliente: selectedClient!.COD_PESSOA,
    });

    if (!result.success) {
      Alert.alert(
        'Erro ao salvar',
        result.error || 'Não foi possível salvar a ordem de serviço. Tente novamente.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Sucesso!',
      `Ordem de serviço #${result.data!.cod_ordem} criada com sucesso!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            setDescription('');
            setServices([]);
            clearFormData();
            navigation.goBack();
          },
        },
      ]
    );
  };

  return {
    // Estado do formulário
    title,
    setTitle,
    description,
    setDescription,
    saving,
    isEditMode,

    // Cliente / Veículo (do context)
    selectedClient,
    selectedVehicle,

    // Serviços
    services,
    servicesExpanded,
    setServicesExpanded,
    detailsExpanded,
    setDetailsExpanded,
    removeService,
    updateService,
    formatCurrency,

    // Ações de navegação
    handleClientSelect,
    handleAddClient,
    handleVehicleAdd,

    // Submit
    handleSave,
  };
};