// screens/ClientSearchScreen.tsx
import ModalHeader from '@/components/ModalHeader';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus, Search, UserPlus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Client } from '../types/client.types';
import type { RootStackParamList } from '../types/navigation.types';

type ClientSearchScreenProps = NativeStackScreenProps<RootStackParamList, 'ClientSearch'>;

const API_BASE_URL = 'http://100.67.122.72:8000';

const ClientSearchScreen = ({ navigation, route }: ClientSearchScreenProps) => {
  const { onSelectClient } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce para não fazer requisição a cada letra digitada
  useEffect(() => {
    if (!searchQuery.trim()) {
      setClients([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      searchClients(searchQuery);
    }, 500); // Aguarda 500ms após parar de digitar

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchClients = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Erro ao buscar clientes:', response.status);
        setClients([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSelectClient = (client: Client) => {
    onSelectClient(client);
    navigation.goBack();
  };

  const handleAddClient = () => {
    navigation.navigate('ClientForm', {
      onClientAdd: (client: Client) => {
        // Adiciona o novo cliente à lista
        setClients([client, ...clients]);
        // Seleciona automaticamente
        onSelectClient(client);
      },
    });
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={styles.clientItem}
      onPress={() => handleSelectClient(item)}
    >
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.nome}</Text>
        <Text style={styles.clientPhone}>{formatPhone(item.telefone)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Buscando clientes...</Text>
        </View>
      );
    }

    if (searchQuery.trim() && hasSearched) {
      // Nenhum resultado encontrado
      return (
        <View style={styles.emptyContainer}>
          <UserPlus size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Nenhum cliente encontrado</Text>
          <Text style={styles.emptyText}>
            Não encontramos clientes com "{searchQuery}"
          </Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleAddClient}
          >
            <Text style={styles.linkButtonText}>Cadastrar agora</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Estado inicial - sem busca
    return (
      <View style={styles.emptyContainer}>
        <Search size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>Buscar cliente</Text>
        <Text style={styles.emptyText}>
          Digite o nome ou telefone do cliente para buscar
        </Text>
      </View>
    );
  };

  // Não mostra o botão de adicionar quando está digitando
  const showAddButton = !searchQuery.trim() && clients.length === 0 && !hasSearched;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ModalHeader
        title="Buscar Cliente"
        onClose={() => navigation.goBack()}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou telefone"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      </View>

      {/* Lista de Clientes */}
      <FlatList
        data={clients}
        renderItem={renderClientItem}
        keyExtractor={item => item.COD_PESSOA.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Botão Adicionar Cliente (aparece apenas no estado inicial) */}
      {showAddButton && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddClient}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar Cliente</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
  },
  listContainer: {
    flexGrow: 1,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ClientSearchScreen;