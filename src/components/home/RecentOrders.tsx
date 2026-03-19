// src/components/home/RecentOrders.tsx

import { useTheme } from '@/contexts/ThemeContext';
import { useRecentOrders } from '@/hooks/useRecentOrders';
import type { AppColors } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation.types';
import type { Order } from '@/types/order-list.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertCircle, Car, ChevronRight, Clock } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface RecentOrdersProps {
  navigation: NavProp;
  refreshTrigger?: number;
}

export const RecentOrders = ({ navigation, refreshTrigger }: RecentOrdersProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { orders, loading, error, refresh } = useRecentOrders();

  // Carrega na montagem e sempre que refreshTrigger mudar (volta à tela)
  useEffect(() => {
    refresh();
  }, [refresh, refreshTrigger]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho da seção */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Ordens Recentes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OrderList')} activeOpacity={0.7}>
          <Text style={styles.seeAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.centerBox}>
            <AlertCircle size={20} color={colors.textTertiary} />
            <Text style={styles.emptyText}>Não foi possível carregar</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.centerBox}>
            <Clock size={20} color={colors.textTertiary} />
            <Text style={styles.emptyText}>Nenhuma ordem encontrada</Text>
          </View>
        ) : (
          orders.map((order, index) => (
            <React.Fragment key={order.cod_ordem}>
              <OrderRow
                order={order}
                colors={colors}
                styles={styles}
                onPress={() => navigation.navigate('OrderDetail', { cod_ordem: order.cod_ordem })}
              />
              {index < orders.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))
        )}
      </View>
    </View>
  );
};

// ── Item individual ───────────────────────────────────────────────────────────

interface OrderRowProps {
  order: Order;
  colors: AppColors;
  styles: ReturnType<typeof makeStyles>;
  onPress: () => void;
}

const OrderRow = ({ order, colors, styles, onPress }: OrderRowProps) => {
  const { veiculo, cliente, observacao } = order;

  const placa   = veiculo?.placa ?? '—';
  const modelo  = [veiculo?.modelo, veiculo?.ano].filter(Boolean).join(' · ') || '—';
  const nomeCliente = cliente?.nome ?? '—';

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      {/* Ícone */}
      <View style={styles.rowIcon}>
        <Car size={18} color={colors.primary} />
      </View>

      {/* Conteúdo */}
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={styles.placa}>{placa}</Text>
          <Text style={styles.modelo}>{modelo}</Text>
        </View>
        <Text style={styles.cliente} numberOfLines={1}>{nomeCliente}</Text>
        {!!observacao && (
          <Text style={styles.obs} numberOfLines={1}>{observacao}</Text>
        )}
      </View>

      <ChevronRight size={16} color={colors.textTertiary} />
    </TouchableOpacity>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      marginTop: 28,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.textTertiary,
    },
    seeAll: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      minHeight: 56,
    },
    centerBox: {
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    emptyText: {
      fontSize: 13,
      color: colors.textTertiary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 12,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.backgroundMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowContent: {
      flex: 1,
      gap: 2,
    },
    rowTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    placa: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    modelo: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    cliente: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    obs: {
      fontSize: 11,
      color: colors.textTertiary,
      fontStyle: 'italic',
    },
  });
