// src/screens/OrderListScreen.tsx

import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrderList } from '@/hooks/useOrderList';
import type { AppColors } from '@/theme/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  EllipsisVertical, Eye, FileText, LogOut, Pencil, Plus, RefreshCw, Trash2,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Pressable, RefreshControl,
  StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteOrder } from '../services/orderListService';
import type { RootStackParamList } from '../types/navigation.types';
import type { Order } from '../types/order-list.types';

type OrderListScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderList'>;

const OrderListScreen = ({ navigation }: OrderListScreenProps) => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { orders, loading, loadingMore, refreshing, error, loadMore, refresh } = useOrderList();
  const [openMenuOrderId, setOpenMenuOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refresh();
    });
    return unsubscribe;
  }, [navigation, refresh]);

  const formatPlate = (plate: string) => {
    if (!plate) return '';
    const clean = plate.replace(/[^A-Z0-9]/gi, '');
    if (clean.length === 7 && /[A-Z]{3}[0-9]{4}/i.test(clean)) return `${clean.substring(0, 3)}-${clean.substring(3)}`;
    return plate;
  };

  const closeMenu = () => setOpenMenuOrderId(null);

  const requestDeleteOrder = async (order: Order, trust: 'y' | 'n' = 'n') => {
    setDeletingOrderId(order.cod_ordem);
    const result = await deleteOrder(order.cod_ordem, trust);
    setDeletingOrderId(null);

    if (!result.success || !result.data) { Alert.alert('Erro', result.error || 'Não foi possível excluir a ordem.'); return; }

    if ('status' in result.data && result.data.status === 'sucesso') {
      Alert.alert('Sucesso', `Ordem #${result.data.cod_ordem} removida com sucesso.`);
      closeMenu(); await refresh(); return;
    }

    if ('quantidade' in result.data && trust === 'n') {
      const { quantidade } = result.data;
      Alert.alert('Confirmar exclusão', `A ordem tem ${quantidade} itens adicionados. Tem certeza que deseja remover?`, [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', style: 'destructive', onPress: () => requestDeleteOrder(order, 'y') },
      ]);
    }
  };

  const toggleOrderMenu = (orderId: number) =>
    setOpenMenuOrderId(prev => prev === orderId ? null : orderId);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aberto': case 'pendente':   return styles.statusPending;
      case 'em andamento': case 'em_andamento': return styles.statusInProgress;
      case 'concluído': case 'concluido':       return styles.statusCompleted;
      case 'cancelado':                         return styles.statusCancelled;
      default:                                  return styles.statusDefault;
    }
  };

  const renderOrderCard = ({ item }: { item: Order }) => {
    const isMenuOpen = openMenuOrderId === item.cod_ordem;
    const isDeleting = deletingOrderId === item.cod_ordem;

    return (
      <TouchableOpacity
        style={styles.card} activeOpacity={0.7}
        onPress={() => navigation.navigate('OrderDetail', { cod_ordem: item.cod_ordem })}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderContent}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderTitle} numberOfLines={1}>{item.observacao}</Text>
              <Text style={styles.orderNumber}>OS #{item.cod_ordem}</Text>
            </View>
            <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.menuWrapper}>
            <Pressable style={styles.menuButton} onPress={e => { e.stopPropagation(); toggleOrderMenu(item.cod_ordem); }}>
              <EllipsisVertical size={18} color={colors.textMeta} />
            </Pressable>
            {isMenuOpen && (
              <View style={styles.dropdownMenu}>
                <Pressable style={styles.dropdownItem} onPress={e => { e.stopPropagation(); closeMenu(); navigation.navigate('OrderDetail', { cod_ordem: item.cod_ordem }); }}>
                  <Eye size={16} color={colors.textMeta} /><Text style={styles.dropdownText}>Ver</Text>
                </Pressable>
                <Pressable style={styles.dropdownItem} onPress={e => { e.stopPropagation(); closeMenu(); navigation.navigate('ServiceForm', { order: item }); }}>
                  <Pencil size={16} color={colors.textMeta} /><Text style={styles.dropdownText}>Editar</Text>
                </Pressable>
                <Pressable style={styles.dropdownItem} disabled={isDeleting} onPress={e => { e.stopPropagation(); requestDeleteOrder(item, 'n'); }}>
                  <Trash2 size={16} color={colors.danger} />
                  <Text style={[styles.dropdownText, styles.deleteText]}>{isDeleting ? 'Excluindo...' : 'Excluir'}</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.vehicleContainer}>
          <View style={styles.plateContainer}>
            <Text style={styles.plate}>{formatPlate(item.veiculo.placa ?? '')}</Text>
          </View>
          <Text style={styles.vehicleInfo}>{item.veiculo.modelo} • {item.veiculo.ano}</Text>
        </View>

        <View style={styles.clientContainer}>
          <Text style={styles.clientLabel}>Cliente:</Text>
          <Text style={styles.clientName} numberOfLines={1}>{item.cliente.nome}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (loading) return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando ordens...</Text>
      </View>
    );
    if (error) return (
      <View style={styles.emptyContainer}>
        <FileText size={64} color={colors.iconMuted} />
        <Text style={styles.emptyTitle}>Erro ao carregar</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <RefreshCw size={20} color={colors.onPrimary} />
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
    return (
      <View style={styles.emptyContainer}>
        <FileText size={64} color={colors.iconMuted} />
        <Text style={styles.emptyTitle}>Nenhuma ordem encontrada</Text>
        <Text style={styles.emptyText}>Crie sua primeira ordem de serviço tocando no botão + abaixo</Text>
      </View>
    );
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Ordens de Serviço</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.7}>
          <LogOut size={24} color={colors.iconStrong} />
        </TouchableOpacity>
      </View>

      <Pressable style={styles.flex} onPress={closeMenu}>
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={item => item.cod_ordem.toString()}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: 20 + insets.bottom },
            orders.length === 0 && styles.emptyListContainer,
          ]}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={loadingMore ? <View style={styles.footerLoader}><ActivityIndicator size="small" color={colors.primary} /></View> : null}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        />
      </Pressable>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 60 }]}
        onPress={() => navigation.navigate('ServiceForm')}
        activeOpacity={0.8}
      >
        <Plus size={28} color={colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.backgroundScreen },
    flex: { flex: 1 },
    header: {
      backgroundColor: colors.background,
      paddingHorizontal: 20, paddingBottom: 16,
      borderBottomWidth: 1, borderBottomColor: colors.border,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
    logoutButton: { padding: 8, borderRadius: 8, backgroundColor: colors.background },
    listContainer: { padding: 16 },
    emptyListContainer: { flexGrow: 1 },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12, padding: 16, marginBottom: 16,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    cardHeaderContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginRight: 8 },
    menuWrapper: { position: 'relative' },
    menuButton: { padding: 6, borderRadius: 8 },
    dropdownMenu: {
      position: 'absolute', top: 32, right: 0, width: 150,
      backgroundColor: colors.surface, borderRadius: 10,
      borderWidth: 1, borderColor: colors.border,
      paddingVertical: 4,
      shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12, shadowRadius: 8, elevation: 10, zIndex: 20,
    },
    dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
    dropdownText: { fontSize: 14, color: colors.textMeta, fontWeight: '500' },
    deleteText: { color: colors.danger },
    orderInfo: { flex: 1, marginRight: 12 },
    orderTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
    orderNumber: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    statusText: { fontSize: 12, fontWeight: '600', color: colors.statusText },
    statusPending:    { backgroundColor: colors.statusPendingBg },
    statusInProgress: { backgroundColor: colors.statusInProgressBg },
    statusCompleted:  { backgroundColor: colors.statusCompletedBg },
    statusCancelled:  { backgroundColor: colors.statusCancelledBg },
    statusDefault:    { backgroundColor: colors.statusDefaultBg },
    divider: { height: 1, backgroundColor: colors.divider, marginVertical: 12 },
    vehicleContainer: { marginBottom: 12 },
    plateContainer: {
      alignSelf: 'flex-start',
      backgroundColor: colors.backgroundMuted,
      paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 6, borderWidth: 2, borderColor: colors.borderStrong, marginBottom: 8,
    },
    plate: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, letterSpacing: 1 },
    vehicleInfo: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
    clientContainer: { flexDirection: 'row', alignItems: 'center' },
    clientLabel: { fontSize: 14, color: colors.textTertiary, marginRight: 6 },
    clientName: { fontSize: 14, fontWeight: '600', color: colors.textMeta, flex: 1 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: { fontSize: 20, fontWeight: '600', color: colors.textMeta, marginTop: 16, marginBottom: 8 },
    emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
    loadingText: { fontSize: 16, color: colors.textSecondary, marginTop: 16 },
    retryButton: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12,
      borderRadius: 8, marginTop: 24, gap: 8,
    },
    retryButtonText: { fontSize: 16, fontWeight: '600', color: colors.onPrimary },
    footerLoader: { paddingVertical: 20, alignItems: 'center' },
    fab: {
      position: 'absolute', right: 20,
      width: 64, height: 64, borderRadius: 32,
      backgroundColor: colors.primary,
      justifyContent: 'center', alignItems: 'center',
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
    },
  });

export default OrderListScreen;
