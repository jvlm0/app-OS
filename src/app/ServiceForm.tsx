import { ChevronDown, ChevronUp, Trash2, UserPlus, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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

const ServiceForm = () => {
  const [title, setTitle] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [description, setDescription] = useState('');
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showClientList, setShowClientList] = useState(false);
  const searchTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Buscar clientes na API
  const searchClients = async (query: string) => {
    if (!query || query.length < 2) {
      setClients([]);
      setShowClientList(false);
      return;
    }

    setLoadingClients(true);
    try {
      const response = await fetch(`http://localhost:8000/clientes?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setClients(data);
      setShowClientList(true);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  // Debounce para pesquisa
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchClients(clientSearch);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [clientSearch]);

  // Limpar resultados quando cliente é selecionado
  useEffect(() => {
    if (selectedClient) {
      setShowClientList(false);
      setClients([]);
    }
  }, [selectedClient]);

  const handleClientSearch = (text: string) => {
    setClientSearch(text);
    setSelectedClient(null);
  };

  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setClientSearch(client.nome);
    setShowClientList(false);
  };

  const clearClientSelection = () => {
    setSelectedClient(null);
    setClientSearch('');
    setClients([]);
    setShowClientList(false);
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

        {/* Cliente */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Cliente <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.clientContainer}>
            <View style={styles.clientSearchWrapper}>
              <TextInput
                style={styles.clientSearchInput}
                placeholder="Digite nome ou telefone do cliente"
                placeholderTextColor="#999"
                value={clientSearch}
                onChangeText={handleClientSearch}
                onFocus={() => {
                  if (clientSearch.length >= 2 && clients.length > 0) {
                    setShowClientList(true);
                  }
                }}
              />
              {loadingClients && (
                <View style={styles.searchLoader}>
                  <ActivityIndicator size="small" color="#666" />
                </View>
              )}
              {selectedClient && !loadingClients && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearClientSelection}
                >
                  <X size={18} color="#666" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.addClientButton}>
              <UserPlus size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Lista de resultados da pesquisa */}
          {showClientList && clients.length > 0 && (
            <View style={styles.clientListContainer}>
              <FlatList
                data={clients}
                keyExtractor={(item) => item.COD_PESSOA.toString()}
                style={styles.clientList}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.clientItem}
                    onPress={() => selectClient(item)}
                  >
                    <Text style={styles.clientItemName}>{item.nome}</Text>
                    <Text style={styles.clientItemPhone}>{item.telefone}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.clientItemSeparator} />}
              />
            </View>
          )}

          {showClientList && clients.length === 0 && !loadingClients && clientSearch.length >= 2 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>Nenhum cliente encontrado</Text>
            </View>
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
  clientContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  clientSearchWrapper: {
    flex: 1,
    position: 'relative',
  },
  clientSearchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    paddingRight: 45,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchLoader: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 18,
    padding: 2,
  },
  clientListContainer: {
    marginTop: 8,
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientList: {
    maxHeight: 300,
  },
  clientItem: {
    padding: 16,
    backgroundColor: '#fff',
  },
  clientItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  clientItemPhone: {
    fontSize: 14,
    color: '#666',
  },
  clientItemSeparator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  noResultsContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addClientButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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