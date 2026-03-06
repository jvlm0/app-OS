// src/components/order-list/OrderCard.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { Order } from '@/types/order-list.types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OrderCardMenu } from './OrderCardMenu';
import { OrderVehiclePlate } from './OrderVehiclePlate';

interface OrderCardProps {
  order: Order;
  isMenuOpen: boolean;
  isDeleting: boolean;
  onPress: () => void;
  onMenuToggle: (e: any) => void;
  onView: (e: any) => void;
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
}

const getStatusStyle = (status: string, styles: ReturnType<typeof makeStyles>) => {
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

export const OrderCard = ({
  order,
  isMenuOpen,
  isDeleting,
  onPress,
  onMenuToggle,
  onView,
  onEdit,
  onDelete,
}: OrderCardProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>

      {/* Cabeçalho: info da ordem + status + menu */}
      <View style={styles.headerRow}>
        <View style={styles.headerContent}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle} numberOfLines={1}>{order.observacao}</Text>
            <Text style={styles.orderNumber}>OS #{order.cod_ordem}</Text>
            {order.problemas && order.problemas.length > 0 && (
              <View style={styles.problemasContainer}>
                {order.problemas.length === 1 ? (
                  <Text style={styles.problemaText} numberOfLines={2}>
                    {order.problemas[0].descricao}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.problemaText} numberOfLines={1}>
                      {order.problemas[0].descricao}
                    </Text>
                    <Text style={styles.problemaText} numberOfLines={1}>
                      {order.problemas[1].descricao}
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>

          <View style={[styles.statusBadge, getStatusStyle(order.status, styles)]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        <OrderCardMenu
          visible={isMenuOpen}
          isDeleting={isDeleting}
          onToggle={onMenuToggle}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </View>

      <View style={styles.divider} />

      {/* Veículo */}
      <View style={styles.vehicleContainer}>
        <OrderVehiclePlate plate={order.veiculo.placa ?? ''} />
        <Text style={styles.vehicleInfo}>
          {order.veiculo.modelo} • {order.veiculo.ano}
        </Text>
      </View>

      {/* Cliente */}
      <View style={styles.clientContainer}>
        <Text style={styles.clientLabel}>Cliente:</Text>
        <Text style={styles.clientName} numberOfLines={1}>{order.cliente.nome}</Text>
      </View>

    </TouchableOpacity>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginRight: 8,
    },
    orderInfo: {
      flex: 1,
      marginRight: 12,
    },
    orderTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    orderNumber: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    problemasContainer: {
      marginTop: 6,
    },
    problemaText: {
      fontSize: 14,
      color: colors.textTertiary,
      lineHeight: 18,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.statusText,
    },
    statusPending:    { backgroundColor: colors.statusPendingBg },
    statusInProgress: { backgroundColor: colors.statusInProgressBg },
    statusCompleted:  { backgroundColor: colors.statusCompletedBg },
    statusCancelled:  { backgroundColor: colors.statusCancelledBg },
    statusDefault:    { backgroundColor: colors.statusDefaultBg },
    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: 12,
    },
    vehicleContainer: {
      marginBottom: 12,
    },
    vehicleInfo: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    clientContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    clientLabel: {
      fontSize: 14,
      color: colors.textTertiary,
      marginRight: 6,
    },
    clientName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMeta,
      flex: 1,
    },
  });
