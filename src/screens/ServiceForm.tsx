import SelectField from '@/components/SelectField';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronDown, ChevronUp, Trash2, UserPlus } from 'lucide-react-native';
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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createOrder } from '../services/orderService';
import type { Client } from '../types/client.types';
import type { RootStackParamList } from '../types/navigation.types';
import type { Vehicle } from '../types/vehicle.types';

interface Service {
  id: string;
  description: string;
  quantity: string;
  unitValue: string;
}

type ServiceFormProps = NativeStackScreenProps<RootStackParamList, 'ServiceForm'>;

const ServiceForm = ({ navigation, route }: ServiceFormProps) => {
  const insets = useSafeAreaInsets();
  const { order } = route.params || {};
  
  const [title, setTitle] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [description, setDescription] = useState('');
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Preencher campos quando uma ordem é passada para edição
  useEffect(() => {
    if (order) {
      setIsEditMode(true);
      setTitle(order.titulo);
      setDescription(order.descricao || '');
      
      // Converter cliente da ordem para o formato Client
      setSelectedClient({
        COD_PESSOA: order.cliente.COD_PESSOA,
        nome: order.cliente.nome,
        telefone: order.cliente.telefone,
        cpfcnpj: order.cliente.cpfcnpj,
      });
      
      // Converter veículo da ordem para o formato Vehicle
      setSelectedVehicle({
        cod_veiculo: order.veiculo.cod_veiculo,
        plate: order.veiculo.placa,
        modelo: order.veiculo.modelo,
        ano: order.veiculo.ano,
        mileage:  (order.veiculo.kmatual!=null) ? order.veiculo.kmatual.toString(): "",
      });
    }
  }, [order]);

  const handleClientSelect = () => {
    navigation.navigate('ClientSearch', {
      onSelectClient: (client: Client) => {
        setSelectedClient(client);
      },
    });
  };

  const handleAddClient = () => {
    navigation.navigate('ClientForm', {
      onClientAdd: (client: Client) => {
        setSelectedClient(client);
      },
    });
  };

  const handleVehicleAdd = () => {
    // Verifica se um cliente foi selecionado
    if (!selectedClient) {
      Alert.alert(
        'Atenção',
        'Selecione um cliente antes de adicionar um veículo',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('CameraScreen', {
      cod_cliente: selectedClient.COD_PESSOA,
      onVehicleAdd: (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
      },
    });
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      description: '',
      quantity: '0',
      unitValue: 'R$ 0,00',
    };
    setServices([...services, newService]);
    setServicesExpanded(true);
  };

  const removeService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices(
      services.map(service =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  const handleSave = async () => {
    // Validar título
    if (!title.trim()) {
      Alert.alert('Atenção', 'O título é obrigatório');
      return;
    }

    // Validar cliente
    if (!selectedClient) {
      Alert.alert('Atenção', 'Selecione um cliente');
      return;
    }

    // Validar veículo
    if (!selectedVehicle) {
      Alert.alert('Atenção', 'Adicione um veículo');
      return;
    }

    // Validar se o veículo tem código (foi cadastrado)
    if (!selectedVehicle.cod_veiculo) {
      Alert.alert(
        'Erro',
        'O veículo não possui um código válido. Por favor, cadastre o veículo novamente.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSaving(true);

    try {
      if (isEditMode) {
        // Modo de edição - mostrar mensagem informando que não há endpoint de atualização
        Alert.alert(
          'Informação',
          'A edição de ordens de serviço ainda não está implementada no backend.',
          [{ text: 'OK' }]
        );
        setSaving(false);
        return;
      }

      // Preparar dados para envio (modo criação)
      const orderData = {
        titulo: title.trim(),
        descricao: description.trim() || '',
        cod_veiculo: selectedVehicle.cod_veiculo,
        cod_cliente: selectedClient.COD_PESSOA,
      };

      const result = await createOrder(orderData);

      if (!result.success) {
        Alert.alert(
          'Erro ao salvar',
          result.error || 'Não foi possível salvar a ordem de serviço. Tente novamente.',
          [{ text: 'OK' }]
        );
        setSaving(false);
        return;
      }

      // Sucesso!
      Alert.alert(
        'Sucesso!',
        `Ordem de serviço #${result.data!.cod_ordem} criada com sucesso!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpar formulário
              setTitle('');
              setSelectedClient(null);
              setSelectedVehicle(null);
              setDescription('');
              setServices([]);
              
              // Voltar para a lista
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar ordem:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao salvar a ordem de serviço. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex:1}}
            >
    <ScrollView style={styles.container} contentContainerStyle = {{paddingBottom: 50+insets.bottom}}>
      <View style={styles.formContainer}>
        {/* Indicador de modo de edição */}
        {isEditMode && (
          <View style={styles.editModeBanner}>
            <Text style={styles.editModeText}>
              Visualizando OS #{order?.cod_ordem}
            </Text>
          </View>
        )}

        {/* Título */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Título <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, isEditMode && styles.inputDisabled]}
            placeholder="Ex.: Manutenção de ar condicionado"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            editable={!isEditMode}
          />
        </View>

        {/* Cliente */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Cliente <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.clientContainer}>
            <TouchableOpacity
              style={[styles.selectFieldButton, isEditMode && styles.selectFieldButtonDisabled]}
              onPress={handleClientSelect}
              disabled={isEditMode}
            >
              <View style={styles.selectFieldContent}>
                {selectedClient ? (
                  <View>
                    <Text style={styles.selectFieldValue}>{selectedClient.nome}</Text>
                    {selectedClient.telefone && (
                      <Text style={styles.selectFieldSubtitle}>{selectedClient.telefone}</Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.selectFieldPlaceholder}>Selecione o cliente</Text>
                )}
              </View>
            </TouchableOpacity>
            
            {!isEditMode && (
              <TouchableOpacity
                style={styles.addClientButton}
                onPress={handleAddClient}
              >
                <UserPlus size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Veículo */}
        <SelectField
          label="Veículo"
          required
          placeholder="Adicionar veículo"
          selectedValue={selectedVehicle?.plate}
          selectedSubtitle={selectedVehicle ? `${selectedVehicle.modelo} - ${selectedVehicle.ano} | ${selectedVehicle.mileage} km` : undefined}
          helperText={!isEditMode ? "Tire uma foto da placa ou digite manualmente" : undefined}
          onPress={isEditMode ? (() => void{}) : handleVehicleAdd}
        />

        {/* Descrição */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, isEditMode && styles.inputDisabled]}
            placeholder="Detalhes adicionais, instruções especiais, etc."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            editable={!isEditMode}
          />
        </View>

        {/* Serviços */}
        <View style={styles.fieldContainer}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setServicesExpanded(!servicesExpanded)}
          >
            <Text style={styles.expandableLabel}>Serviços (opcional)</Text>
            {servicesExpanded ? (
              <ChevronUp size={20} color="#666" />
            ) : (
              <ChevronDown size={20} color="#666" />
            )}
          </TouchableOpacity>

          {servicesExpanded && (
            <View style={styles.servicesContainer}>
              {services.map((service, index) => (
                <View key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceTitle}>SERVIÇO {index + 1}</Text>
                    {!isEditMode && (
                      <TouchableOpacity
                        onPress={() => removeService(service.id)}
                        style={styles.deleteButton}
                      >
                        <Trash2 size={20} color="#666" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.serviceField}>
                    <Text style={styles.serviceLabel}>
                      DESCRIÇÃO <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.serviceInput}
                      placeholder="Ex.: Mão de obra"
                      placeholderTextColor="#999"
                      value={service.description}
                      onChangeText={value =>
                        updateService(service.id, 'description', value)
                      }
                      editable={!isEditMode}
                    />
                  </View>

                  <View style={styles.serviceRow}>
                    <View style={styles.serviceFieldHalf}>
                      <Text style={styles.serviceLabel}>
                        QUANTIDADE <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={styles.serviceInput}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={service.quantity}
                        onChangeText={value =>
                          updateService(service.id, 'quantity', value)
                        }
                        editable={!isEditMode}
                      />
                    </View>

                    <View style={styles.serviceFieldHalf}>
                      <Text style={styles.serviceLabel}>
                        VALOR UNITÁRIO <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={styles.serviceInput}
                        placeholder="R$ 0,00"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={service.unitValue}
                        onChangeText={value => {
                          const formatted = formatCurrency(value);
                          updateService(service.id, 'unitValue', formatted);
                        }}
                        editable={!isEditMode}
                      />
                    </View>
                  </View>
                </View>
              ))}

              {!isEditMode && (
                <TouchableOpacity
                  style={styles.addServiceButton}
                  onPress={addService}
                >
                  <Text style={styles.addServiceText}>+ Adicionar outro serviço</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Detalhes */}
        <View style={styles.fieldContainer}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setDetailsExpanded(!detailsExpanded)}
          >
            <Text style={styles.expandableLabel}>Detalhes (opcional)</Text>
            {detailsExpanded ? (
              <ChevronUp size={20} color="#666" />
            ) : (
              <ChevronDown size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>

        {/* Botão Salvar - apenas em modo de criação */}
        {!isEditMode && (
          <TouchableOpacity
            style={[styles.continueButton, saving && styles.continueButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.continueButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  
    </KeyboardAvoidingView>
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
    padding: 20,
  },
  editModeBanner: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  editModeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
  clientContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  selectFieldButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectFieldButtonDisabled: {
    backgroundColor: '#f9f9f9',
    opacity: 0.7,
  },
  selectFieldContent: {
    minHeight: 24,
    justifyContent: 'center',
  },
  selectFieldPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  selectFieldValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  selectFieldSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addClientButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#f9f9f9',
    opacity: 0.7,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  expandableHeader: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  expandableLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  servicesContainer: {
    marginTop: 16,
  },
  serviceCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
  deleteButton: {
    padding: 4,
  },
  serviceField: {
    marginBottom: 16,
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  serviceInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  serviceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceFieldHalf: {
    flex: 1,
  },
  addServiceButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  addServiceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonDisabled: {
    backgroundColor: '#666',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ServiceForm;