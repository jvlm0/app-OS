import SelectField from '@/components/SelectField';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronDown, ChevronUp, Trash2, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
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

const ServiceForm = ({ navigation }: ServiceFormProps) => {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [description, setDescription] = useState('');
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

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

  return (
    <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
    <ScrollView style={styles.container} 
                contentContainerStyle={{
                    paddingBottom: 20 + insets.bottom,
                     }}
                keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
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
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Cliente <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.clientContainer}>
            <TouchableOpacity
              style={styles.selectFieldButton}
              onPress={handleClientSelect}
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
            
            <TouchableOpacity
              style={styles.addClientButton}
              onPress={handleAddClient}
            >
              <UserPlus size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Veículo */}
        <SelectField
          label="Veículo"
          required
          placeholder="Adicionar veículo"
          selectedValue={selectedVehicle?.plate}
          selectedSubtitle={selectedVehicle ? `${selectedVehicle.modelo} - ${selectedVehicle.ano} | ${selectedVehicle.mileage} km` : undefined}
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
                    <TouchableOpacity
                      onPress={() => removeService(service.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={20} color="#666" />
                    </TouchableOpacity>
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
                      />
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addServiceButton}
                onPress={addService}
              >
                <Text style={styles.addServiceText}>+ Adicionar outro serviço</Text>
              </TouchableOpacity>
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

        {/* Botão Continuar */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
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
    paddingBottom: 10
  },
  formContainer: {
    padding: 20,
    paddingBottom: 0,
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
    marginTop: 32,
    marginBottom: 30,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ServiceForm;