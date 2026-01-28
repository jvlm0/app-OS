import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
}

type RootStackParamList = {
  ServiceForm: undefined;
  ClientSearch: {
    onSelectClient: (client: Client) => void;
  };
};

type ClientSearchScreenProps = NativeStackScreenProps<RootStackParamList, 'ClientSearch'>;

const ClientSearchScreen = ({ navigation, route }: ClientSearchScreenProps) => {
  const [clientSearch, setClientSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const searchTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const { onSelectClient } = route.params;

  // Buscar clientes na API
  const searchClients = async (query: string) => {
    if (!query || query.length < 2) {
      setClients([]);
      return;
    }

    setLoadingClients(true);
    try {
      const response = await fetch(
        `http://localhost:8000/clientes?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setClients(data);
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

  const handleSelectClient = (client: Client) => {
    onSelectClient(client);
    navigation.goBack();
  };

  const handleClearSearch = () => {
    setClientSearch('');
    setClients([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <X size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecionar Cliente</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Digite nome ou telefone do cliente"
            placeholderTextColor="#999"
            value={clientSearch}
            onChangeText={setClientSearch}
            autoFocus
          />
          {loadingClients && (
            <View style={styles.searchLoader}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          )}
          {clientSearch.length > 0 && !loadingClients && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSearch}
            >
              <X size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.listContainer}>
        {loadingClients ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Buscando clientes...</Text>
          </View>
        ) : clientSearch.length < 2 ? (
          <View style={styles.centerContainer}>
            <Search size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              Digite pelo menos 2 caracteres para buscar
            </Text>
          </View>
        ) : clients.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
            <Text style={styles.emptySubtext}>
              Tente buscar com outro termo
            </Text>
          </View>
        ) : (
          <FlatList
            data={clients}
            keyExtractor={(item) => item.COD_PESSOA.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.clientItem}
                onPress={() => handleSelectClient(item)}
                activeOpacity={0.7}
              >
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{item.nome}</Text>
                  <Text style={styles.clientPhone}>{item.telefone}</Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  searchLoader: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  clientItem: {
    padding: 20,
    backgroundColor: '#fff',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 20,
  },
});

export default ClientSearchScreen;