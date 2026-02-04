// screens/OrderListScreen.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FileText, Plus, RefreshCw } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getOrders } from '../services/orderListService';
import type { RootStackParamList } from '../types/navigation.types';
import type { Order } from '../types/order-list.types';

type OrderListScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderList'>;

const OrderListScreen = ({ navigation }: OrderListScreenProps) => {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getOrders();

      if (!result.success) {
        setError(result.error || 'Erro ao carregar ordens');
        setOrders([]);
      } else {
        setOrders(result.data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar ordens:', err);
      setError('Erro ao carregar ordens');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, []);

  const formatPlate = (plate: string) => {
    if (!plate) return '';
    const cleanPlate = plate.replace(/[^A-Z0-9]/gi, '');
    if (cleanPlate.length === 7) {
      // Formato antigo: ABC-1234
      if (/[A-Z]{3}[0-9]{4}/i.test(cleanPlate)) {
        return `${cleanPlate.substring(0, 3)}-${cleanPlate.substring(3)}`;
      }
      // Formato Mercosul: ABC1D23
      return cleanPlate;
    }
    return plate;
  };

  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => {
        // Futuramente pode navegar para detalhes da ordem
        console.log('Ordem selecionada:', item.cod_ordem);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderTitle} numberOfLines={1}>
            {item.titulo}
          </Text>
          <Text style={styles.orderNumber}>
            OS #{item.cod_ordem}
          </Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {item.descricao && (
        <Text style={styles.description} numberOfLines={2}>
          {item.descricao}
        </Text>
      )}

      <View style={styles.divider} />

      <View style={styles.vehicleContainer}>
        <View style={styles.plateContainer}>
          <Text style={styles.plate}>{formatPlate(item.veiculo.placa)}</Text>
        </View>
        <Text style={styles.vehicleInfo}>
          {item.veiculo.modelo} • {item.veiculo.ano}
        </Text>
      </View>

      <View style={styles.clientContainer}>
        <Text style={styles.clientLabel}>Cliente:</Text>
        <Text style={styles.clientName} numberOfLines={1}>
          {item.cliente.nome}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aberto':
      case 'pendente':
        return styles.statusPending;
      case 'em andamento':
      case 'em_andamento':
        return styles.statusInProgress;
      case 'concluído':
      case 'concluido':
        return styles.statusCompleted;
      case 'cancelado':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Carregando ordens...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <FileText size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Erro ao carregar</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadOrders}>
            <RefreshCw size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <FileText size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>Nenhuma ordem encontrada</Text>
        <Text style={styles.emptyText}>
          Crie sua primeira ordem de serviço tocando no botão + abaixo
        </Text>
      </View>
    );
  };

  return (
    
    <View style={{flex: 1, backgroundColor: '#f5f5f5', paddingBottom: insets.bottom}}>
      <View style={[styles.header, { paddingTop: insets.top}]}>
        <Text style={styles.headerTitle}>Ordens de Serviço</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.cod_ordem.toString()}
        contentContainerStyle={[
          styles.listContainer,
          orders.length === 0 && styles.emptyListContainer,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => navigation.navigate('ServiceForm')}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
    marginRight: 12,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statusPending: {
    backgroundColor: '#FF9800',
  },
  statusInProgress: {
    backgroundColor: '#2196F3',
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusCancelled: {
    backgroundColor: '#F44336',
  },
  statusDefault: {
    backgroundColor: '#9E9E9E',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  vehicleContainer: {
    marginBottom: 12,
  },
  plateContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#333',
    marginBottom: 8,
  },
  plate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  clientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientLabel: {
    fontSize: 14,
    color: '#999',
    marginRight: 6,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default OrderListScreen;