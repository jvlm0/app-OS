// src/screens/OrderDetailScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import { SaveButtonWithSummary } from '@/components/service-form/Savebuttonwithsummary';
import { useFormData } from '@/contexts/FormDataContext';
import type { RootStackParamList } from '@/types/navigation.types';
import type { ItemProdutoResponse, ServicoResponse } from '@/types/order-list.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderDetail } from '../hooks/useOrderDetail';

type OrderDetailProps = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderDetailScreen = ({ navigation, route }: OrderDetailProps) => {
  const { cod_ordem } = route.params;
  const { updatedOrder, setUpdatedOrder } = useFormData();
  const { order, setOrder, loading, error, refresh } = useOrderDetail(cod_ordem);

  // Ao voltar do ServiceForm, o context já tem a ordem atualizada —
  // aplica direto no estado local e limpa o context, sem novo GET
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (updatedOrder) {
        setOrder(updatedOrder);
        setUpdatedOrder(null);
      }
    });
    return unsubscribe;
  }, [navigation, updatedOrder]);

  const handleEdit = () => {
    if (!order) return;
    navigation.navigate('ServiceForm', { order });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ModalHeader title="Detalhes da Ordem" onClose={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
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
  }

  const formatCurrency = (value: number) =>
    `R$ ${Number(value).toFixed(2).replace('.', ',')}`;

  return (
    <SafeAreaView style={styles.container}>
      <ModalHeader
        title={`Ordem #${order.cod_ordem}`}
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Status badge */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
          
        </View>

        {/* Título */}
        {order.titulo ? (
          <Section title="Título">
            <Text style={styles.valueText}>{order.titulo}</Text>
          </Section>
        ) : null}

        {/* Descrição */}
        {order.descricao ? (
          <Section title="Descrição">
            <Text style={styles.valueText}>{order.descricao}</Text>
          </Section>
        ) : null}

        {/* Cliente */}
        <Section title="Cliente">
          <InfoRow label="Nome" value={order.cliente.nome} />
          {order.cliente.telefone ? (
            <InfoRow label="Telefone" value={order.cliente.telefone} />
          ) : null}
          {order.cliente.cpfcnpj ? (
            <InfoRow label="CPF/CNPJ" value={order.cliente.cpfcnpj} />
          ) : null}
        </Section>

        {/* Veículo */}
        <Section title="Veículo">
          {order.veiculo.placa ? (
            <InfoRow label="Placa" value={order.veiculo.placa} />
          ) : null}
          {order.veiculo.modelo ? (
            <InfoRow label="Modelo" value={order.veiculo.modelo} />
          ) : null}
          {order.veiculo.ano ? (
            <InfoRow label="Ano" value={order.veiculo.ano} />
          ) : null}
          {order.veiculo.kmatual != null ? (
            <InfoRow label="Km atual" value={`${order.veiculo.kmatual} km`} />
          ) : null}
          {order.veiculo.cor ? (
            <InfoRow label="Cor" value={order.veiculo.cor} />
          ) : null}
          {order.veiculo.marca ? (
            <InfoRow label="Marca" value={order.veiculo.marca} />
          ) : null}
          {order.veiculo.chassi ? (
            <InfoRow label="Chassi" value={order.veiculo.chassi} />
          ) : null}
        </Section>

        {/* Serviços */}
        {order.servicos && order.servicos.length > 0 ? (
          <Section title={`Serviços (${order.servicos.length})`}>
            {order.servicos.map((s: ServicoResponse) => (
              <View key={s.cod_servico} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{s.descricao}</Text>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Qtd:</Text>
                  <Text style={styles.itemValue}>{s.quantidade}</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Valor unitário:</Text>
                  <Text style={styles.itemValue}>{formatCurrency(s.valorUnitario)}</Text>
                </View>
                {s.desconto > 0 ? (
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Desconto ({s.desconto}%):</Text>
                    <Text style={styles.itemValue}>{formatCurrency(s.quantidade*s.valorUnitario*s.desconto/100)}</Text>
                  </View>
                ) : null}
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Equipe:</Text>
                  <Text style={styles.itemValue}>{s.equipe.nome}</Text>
                </View>
                {s.vendedores.length > 0 ? (
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Vendedores:</Text>
                    <Text style={styles.itemValue}>
                      {s.vendedores.map(v => v.nome).join(', ')}
                    </Text>
                  </View>
                ) : null}
              </View>
            ))}
          </Section>
        ) : null}

        {/* Produtos */}
        {order.produtos && order.produtos.length > 0 ? (
          <Section title={`Produtos (${order.produtos.length})`}>
            {order.produtos.map((p: ItemProdutoResponse) => (
              <View key={p.cod_itemProduto} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{p.nome}</Text>
                {p.marca ? (
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Marca:</Text>
                    <Text style={styles.itemValue}>{p.marca}</Text>
                  </View>
                ) : null}
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Qtd:</Text>
                  <Text style={styles.itemValue}>{Number(p.quantidade)}</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Valor unitário:</Text>
                  <Text style={styles.itemValue}>{formatCurrency(Number(p.valorUnitario))}</Text>
                </View>
                {Number(p.desconto) > 0 ? (
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Desconto ({p.desconto}%):</Text>
                    <Text style={styles.itemValue}>{formatCurrency(p.quantidade*p.valorUnitario*p.desconto/100)}</Text>
                  </View>
                ) : null}
                {p.vendedores.length > 0 ? (
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Vendedores:</Text>
                    <Text style={styles.itemValue}>
                      {p.vendedores.map(v => v.nome).join(', ')}
                    </Text>
                  </View>
                ) : null}
              </View>
            ))}
          </Section>
        ) : null}
      </ScrollView>
      
      <SaveButtonWithSummary
                    onPress={handleEdit}
                    loading={false}
                    disabled={false}
                    text={'Editar'}
                    floating={false}
                    services={order.servicos || []}
                    products={order.produtos || []}
          />        
    </SafeAreaView>
  );
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'aberta':
    case 'aberto':
      return { backgroundColor: '#e8f5e9', borderColor: '#4caf50' };
    case 'concluída':
    case 'concluido':
    case 'concluída':
      return { backgroundColor: '#e3f2fd', borderColor: '#2196f3' };
    case 'cancelada':
    case 'cancelado':
      return { backgroundColor: '#ffebee', borderColor: '#f44336' };
    default:
      return { backgroundColor: '#f5f5f5', borderColor: '#9e9e9e' };
  }
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#f44336', textAlign: 'center', marginBottom: 16 },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: { fontSize: 13, fontWeight: '600', color: '#333' },
  editButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionContent: {},

  infoRow: { flexDirection: 'row', marginBottom: 6 },
  infoLabel: { fontSize: 14, color: '#666', width: 90, flexShrink: 0 },
  infoValue: { fontSize: 14, color: '#000', flex: 1, fontWeight: '500' },

  valueText: { fontSize: 15, color: '#333', lineHeight: 22 },

  itemCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#000', marginBottom: 8 },
  itemRow: { flexDirection: 'row', marginBottom: 4 },
  itemLabel: { fontSize: 13, color: '#666', width: 110, flexShrink: 0 },
  itemValue: { fontSize: 13, color: '#333', flex: 1, fontWeight: '500' },
});

export default OrderDetailScreen;