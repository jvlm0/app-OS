import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronDown, ChevronRight, ChevronUp, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Service {
  id: string;
  description: string;
  quantity: string;
  unitValue: string;
}

interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
}

interface Vehicle {
  plate: string;
  mileage: string;
}

type RootStackParamList = {
  ServiceForm: undefined;
  ClientSearch: {
    onSelectClient: (client: Client) => void;
  };
  CameraScreen: {
    onVehicleAdd: (vehicle: Vehicle) => void;
  };
  VehicleForm: {
    plate?: string;
    onVehicleAdd: (vehicle: Vehicle) => void;
  };
};

type ServiceFormProps = NativeStackScreenProps<RootStackParamList, 'ServiceForm'>;

const ServiceForm = ({ navigation }: ServiceFormProps) => {
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

  const handleVehicleAdd = () => {
    navigation.navigate('CameraScreen', {
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
    <ScrollView style={styles.container}>
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

        {/* Cliente - Campo Fake Clicável */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Cliente <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.clientSelectButton}
            onPress={handleClientSelect}
          >
            <Text
              style={[
                styles.clientSelectText,
                selectedClient ? styles.clientSelectedText : styles.clientPlaceholderText,
              ]}
            >
              {selectedClient ? selectedClient.nome : 'Selecione o cliente'}
            </Text>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
          
          {selectedClient && (
            <Text style={styles.clientPhoneText}>{selectedClient.telefone}</Text>
          )}
        </View>

        {/* Veículo - Campo Fake Clicável */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Veículo <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.clientSelectButton}
            onPress={handleVehicleAdd}
          >
            <View style={styles.vehicleContent}>
              <Text
                style={[
                  styles.clientSelectText,
                  selectedVehicle ? styles.clientSelectedText : styles.clientPlaceholderText,
                ]}
              >
                {selectedVehicle ? selectedVehicle.plate : 'Adicionar veículo'}
              </Text>
              {selectedVehicle && (
                <Text style={styles.vehicleMileageText}>
                  {selectedVehicle.mileage} km
                </Text>
              )}
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
          
          {!selectedVehicle && (
            <Text style={styles.helperText}>
              Tire uma foto da placa ou digite manualmente
            </Text>
          )}
        </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  clientSelectButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  clientSelectText: {
    fontSize: 16,
  },
  clientPlaceholderText: {
    color: '#999',
  },
  clientSelectedText: {
    color: '#000',
    fontWeight: '600',
  },
  clientPhoneText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginLeft: 4,
  },
  vehicleContent: {
    flex: 1,
  },
  vehicleMileageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginLeft: 4,
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
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ServiceForm;