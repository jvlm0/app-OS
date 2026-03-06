// src/screens/OrderDetailScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import { ClienteSection } from '@/components/order-detail/ClienteSection';
import ImagensGallery from '@/components/order-detail/ImagensGallery';
import { OrderSection } from '@/components/order-detail/OrderSection';
import { OrderStatusBadge } from '@/components/order-detail/OrderStatusBadge';
import { ProblemasSection } from '@/components/order-detail/ProblemasSection';
import { ProdutosSection } from '@/components/order-detail/ProdutosSection';
import { ServicosSection } from '@/components/order-detail/ServicosSection';
import { VeiculoSection } from '@/components/order-detail/VeiculoSection';
import { SaveButtonWithSummary } from '@/components/service-form/Savebuttonwithsummary';
import { useFormData } from '@/contexts/FormDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderDetail } from '../hooks/useOrderDetail';

type OrderDetailProps = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderDetailScreen = ({ navigation, route }: OrderDetailProps) => {
  const { cod_ordem } = route.params;
  const { updatedOrder, setUpdatedOrder } = useFormData();
  const { order, setOrder, loading, error, refresh } = useOrderDetail(cod_ordem);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (updatedOrder) { setOrder(updatedOrder); setUpdatedOrder(null); }
    });
    return unsubscribe;
  }, [navigation, updatedOrder]);

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <ModalHeader title="Detalhes da Ordem" onClose={() => navigation.goBack()} />
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    </SafeAreaView>
  );

  if (error || !order) return (
    <SafeAreaView style={styles.container}>
      <ModalHeader title="Detalhes da Ordem" onClose={() => navigation.goBack()} />
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Ordem não encontrada'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ModalHeader title={`Ordem #${order.cod_ordem}`} onClose={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        <View style={styles.statusRow}>
          <OrderStatusBadge status={order.status} />
        </View>

        {order.observacao ? (
          <OrderSection title="Observação">
            <Text style={styles.valueText}>{order.observacao}</Text>
          </OrderSection>
        ) : null}

        <ClienteSection cliente={order.cliente} />
        <VeiculoSection veiculo={order.veiculo} />

        <ProblemasSection problemas={order.problemas ?? []} />

        {order.imagens && order.imagens.length > 0 && (
          <OrderSection title={`Imagens (${order.imagens.length})`}>
            <ImagensGallery imagens={order.imagens} />
          </OrderSection>
        )}

        <ServicosSection servicos={order.servicos} />
        <ProdutosSection produtos={order.produtos} />

      </ScrollView>

      <SaveButtonWithSummary
        onPress={() => order && navigation.navigate('ServiceForm', { order })}
        loading={false}
        disabled={false}
        text="Editar"
        floating={false}
        services={order.servicos || []}
        products={order.produtos || []}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container:    { flex: 1, backgroundColor: colors.background },
    centered:     { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    scroll:       { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },

    loadingText:  { marginTop: 12, fontSize: 16, color: colors.textSecondary },
    errorText:    { fontSize: 16, color: colors.textError, textAlign: 'center', marginBottom: 16 },
    retryButton:  { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    retryText:    { color: colors.onPrimary, fontWeight: '600' },

    statusRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    valueText:    { fontSize: 15, color: colors.textMeta, lineHeight: 22 },
  });

export default OrderDetailScreen;
