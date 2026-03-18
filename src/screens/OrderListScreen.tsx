// src/screens/OrderListScreen.tsx

import { OrderCard } from '@/components/order-list/OrderCard';
import { OrderListEmptyState } from '@/components/order-list/OrderListEmptyState';
import { OrderListHeader } from '@/components/order-list/OrderListHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useOrderList } from '@/hooks/useOrderList';
import type { AppColors } from '@/theme/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomNavBar } from '@/components/shared/BottomNavBar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Pressable,
  RefreshControl, StyleSheet, TouchableOpacity, View,
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
    const unsubscribe = navigation.addListener('focus', () => { refresh(); });
    return unsubscribe;
  }, [navigation, refresh]);

  const closeMenu = () => setOpenMenuOrderId(null);

  const toggleOrderMenu = (orderId: number) =>
    setOpenMenuOrderId(prev => (prev === orderId ? null : orderId));

  const requestDeleteOrder = async (order: Order, trust: 'y' | 'n' = 'n') => {
    setDeletingOrderId(order.cod_ordem);
    const result = await deleteOrder(order.cod_ordem, trust);
    setDeletingOrderId(null);

    if (!result.success || !result.data) {
      Alert.alert('Erro', result.error || 'Não foi possível excluir a ordem.');
      return;
    }

    if ('status' in result.data && result.data.status === 'sucesso') {
      Alert.alert('Sucesso', `Ordem #${result.data.cod_ordem} removida com sucesso.`);
      closeMenu();
      await refresh();
      return;
    }

    if ('quantidade' in result.data && trust === 'n') {
      const { quantidade } = result.data;
      Alert.alert(
        'Confirmar exclusão',
        `A ordem tem ${quantidade} itens adicionados. Tem certeza que deseja remover?`,
        [
          { text: 'Não', style: 'cancel' },
          { text: 'Sim', style: 'destructive', onPress: () => requestDeleteOrder(order, 'y') },
        ],
      );
    }
  };

  return (
    <View style={styles.screen}>
      <OrderListHeader onLogout={logout} />

      <Pressable style={styles.flex} onPress={closeMenu}>
        <FlatList
          data={orders}
          keyExtractor={item => item.cod_ordem.toString()}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              isMenuOpen={openMenuOrderId === item.cod_ordem}
              isDeleting={deletingOrderId === item.cod_ordem}
              onPress={() => navigation.navigate('OrderDetail', { cod_ordem: item.cod_ordem })}
              onMenuToggle={e => { e.stopPropagation(); toggleOrderMenu(item.cod_ordem); }}
              onView={e => { e.stopPropagation(); closeMenu(); navigation.navigate('OrderDetail', { cod_ordem: item.cod_ordem }); }}
              onEdit={e => { e.stopPropagation(); closeMenu(); navigation.navigate('ServiceForm', { order: item }); }}
              onDelete={e => { e.stopPropagation(); requestDeleteOrder(item, 'n'); }}
            />
          )}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: 20 },
            orders.length === 0 && styles.emptyListContainer,
          ]}
          ListEmptyComponent={
            <OrderListEmptyState loading={loading} error={error} onRetry={refresh} />
          }
          ListFooterComponent={
            loadingMore
              ? <View style={styles.footerLoader}><ActivityIndicator size="small" color={colors.primary} /></View>
              : null
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        />
      </Pressable>

      <BottomNavBar navigation={navigation} activeTab="OrderList" />
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    screen:           { flex: 1, backgroundColor: colors.backgroundScreen },
    flex:             { flex: 1 },
    listContainer:    { padding: 16 },
    emptyListContainer: { flexGrow: 1 },
    footerLoader:     { paddingVertical: 20, alignItems: 'center' },

  });

export default OrderListScreen;
