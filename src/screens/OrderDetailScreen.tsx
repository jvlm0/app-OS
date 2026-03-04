// src/screens/OrderDetailScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import ImagensGallery from '@/components/order-detail/ImagensGallery';
import { SaveButtonWithSummary } from '@/components/service-form/Savebuttonwithsummary';
import { useFormData } from '@/contexts/FormDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation.types';
import type { ItemProdutoResponse, ServicoResponse } from '@/types/order-list.types';
import type { ProblemaOrdem } from '@/types/order.types';
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

  const fmtCurrency = (v: number) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`;

  const getStatusBadgeStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aberta': case 'aberto':
        return { backgroundColor: colors.statusAbertaBg, borderColor: colors.statusAbertaBorder };
      case 'concluída': case 'concluido': case 'concluída':
        return { backgroundColor: colors.statusConcluidaBg, borderColor: colors.statusConcluidaBorder };
      case 'cancelada': case 'cancelado':
        return { backgroundColor: colors.statusCanceladaBg, borderColor: colors.statusCanceladaBorder };
      default:
        return { backgroundColor: colors.statusNeutralBg, borderColor: colors.statusNeutralBorder };
    }
  };

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

        {/* Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, getStatusBadgeStyle(order.status)]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        {/* Observação */}
        {order.observacao ? (
          <Section title="Observação" colors={colors}>
            <Text style={styles.valueText}>{order.observacao}</Text>
          </Section>
        ) : null}

        {/* Cliente */}
        <Section title="Cliente" colors={colors}>
          <InfoRow label="Nome" value={order.cliente.nome} colors={colors} />
          {order.cliente.telefone && <InfoRow label="Telefone" value={order.cliente.telefone} colors={colors} />}
          {order.cliente.cpfcnpj && <InfoRow label="CPF/CNPJ" value={order.cliente.cpfcnpj} colors={colors} />}
        </Section>

        {/* Veículo */}
        <Section title="Veículo" colors={colors}>
          {order.veiculo.placa  && <InfoRow label="Placa"  value={order.veiculo.placa}  colors={colors} />}
          {order.veiculo.modelo && <InfoRow label="Modelo" value={order.veiculo.modelo} colors={colors} />}
          {order.veiculo.ano    && <InfoRow label="Ano"    value={order.veiculo.ano}    colors={colors} />}
          {order.veiculo.kmatual != null && <InfoRow label="Km atual" value={`${order.veiculo.kmatual} km`} colors={colors} />}
          {order.veiculo.cor    && <InfoRow label="Cor"    value={order.veiculo.cor}    colors={colors} />}
          {order.veiculo.marca  && <InfoRow label="Marca"  value={order.veiculo.marca}  colors={colors} />}
          {order.veiculo.chassi && <InfoRow label="Chassi" value={order.veiculo.chassi} colors={colors} />}
        </Section>

        {/* Problemas */}
        {order.problemas && order.problemas?.length > 0 && (
          <Section title={`Problemas Relatados (${order.problemas.length})`} colors={colors}>
            {order.problemas.map((p: ProblemaOrdem, i: number) => (
              <View key={i} style={styles.itemCard}>
                <View style={styles.problemaHeader}>
                  <Text style={styles.problemaIndex}>PROBLEMA {i + 1}</Text>
                </View>
                <View style={styles.problemaBlock}>
                  <Text style={styles.problemaFieldLabel}>Problema Relatado</Text>
                  <Text style={styles.problemaText}>{p.descricao}</Text>
                </View>
                {p.solucao ? (
                  <View style={[styles.problemaBlock, styles.solucaoBlock]}>
                    <Text style={styles.problemaFieldLabel}>Solução</Text>
                    <Text style={styles.problemaText}>{p.solucao}</Text>
                  </View>
                ) : (
                  <View style={styles.semSolucaoBadge}>
                    <Text style={styles.semSolucaoText}>Sem solução registrada</Text>
                  </View>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Imagens */}
        {order.imagens && order.imagens.length > 0 && (
          <Section title={`Imagens (${order.imagens.length})`} colors={colors}>
            <ImagensGallery imagens={order.imagens} />
          </Section>
        )}

        {/* Serviços */}
        {order.servicos && order.servicos?.length > 0 && (
          <Section title={`Serviços (${order.servicos.length})`} colors={colors}>
            {order.servicos.map((s: ServicoResponse) => (
              <View key={s.cod_servico} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{s.descricao}</Text>
                <ItemRow label="Qtd:" value={String(s.quantidade)} colors={colors} />
                <ItemRow label="Valor unitário:" value={fmtCurrency(s.valorUnitario)} colors={colors} />
                {s.desconto > 0 && (
                  <ItemRow
                    label={`Desconto (${s.desconto}%):`}
                    value={fmtCurrency(s.quantidade * s.valorUnitario * s.desconto / 100)}
                    colors={colors}
                  />
                )}
                <ItemRow label="Equipe:" value={s.equipe.nome} colors={colors} />
                {s.vendedores.length > 0 && (
                  <ItemRow label="Vendedores:" value={s.vendedores.map(v => v.nome).join(', ')} colors={colors} />
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Produtos */}
        {order.produtos && order.produtos?.length > 0 && (
          <Section title={`Produtos (${order.produtos.length})`} colors={colors}>
            {order.produtos.map((p: ItemProdutoResponse) => (
              <View key={p.cod_itemProduto} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{p.nome}</Text>
                {p.marca && <ItemRow label="Marca:" value={p.marca} colors={colors} />}
                <ItemRow label="Qtd:" value={String(Number(p.quantidade))} colors={colors} />
                <ItemRow label="Valor unitário:" value={fmtCurrency(Number(p.valorUnitario))} colors={colors} />
                {Number(p.desconto) > 0 && (
                  <ItemRow
                    label={`Desconto (${p.desconto}%):`}
                    value={fmtCurrency(p.quantidade * p.valorUnitario * p.desconto / 100)}
                    colors={colors}
                  />
                )}
                {p.vendedores.length > 0 && (
                  <ItemRow label="Vendedores:" value={p.vendedores.map(v => v.nome).join(', ')} colors={colors} />
                )}
              </View>
            ))}
          </Section>
        )}

      </ScrollView>

      <SaveButtonWithSummary
        onPress={() => order && navigation.navigate('ServiceForm', { order })}
        loading={false} disabled={false} text="Editar" floating={false}
        services={order.servicos || []} products={order.produtos || []}
      />
    </SafeAreaView>
  );
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const Section = ({ title, children, colors }: { title: string; children: React.ReactNode; colors: AppColors }) => {
  const styles = makeStyles(colors);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
};

const InfoRow = ({ label, value, colors }: { label: string; value?: string | null; colors: AppColors }) => {
  const styles = makeStyles(colors);
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const ItemRow = ({ label, value, colors }: { label: string; value: string; colors: AppColors }) => {
  const styles = makeStyles(colors);
  return (
    <View style={styles.itemRow}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    scroll: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },

    loadingText: { marginTop: 12, fontSize: 16, color: colors.textSecondary },
    errorText: { fontSize: 16, color: colors.textError, textAlign: 'center', marginBottom: 16 },
    retryButton: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    retryText: { color: colors.onPrimary, fontWeight: '600' },

    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    statusText: { fontSize: 13, fontWeight: '600', color: colors.statusDetailText },

    section: { marginBottom: 24 },
    sectionTitle: {
      fontSize: 16, fontWeight: '700', color: colors.textPrimary,
      marginBottom: 10, paddingBottom: 6,
      borderBottomWidth: 1, borderBottomColor: colors.sectionDivider,
    },

    infoRow: { flexDirection: 'row', marginBottom: 6 },
    infoLabel: { fontSize: 14, color: colors.textSecondary, width: 90, flexShrink: 0 },
    infoValue: { fontSize: 14, color: colors.textPrimary, flex: 1, fontWeight: '500' },
    valueText: { fontSize: 15, color: colors.textMeta, lineHeight: 22 },

    // Problemas
    problemaHeader: { marginBottom: 12 },
    problemaIndex: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.5 },
    problemaBlock: { marginBottom: 10 },
    solucaoBlock: { paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.dividerSubtle },
    problemaFieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
    problemaText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
    semSolucaoBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.semSolucaoBg,
      borderRadius: 6, borderWidth: 1, borderColor: colors.semSolucaoBorder,
      paddingHorizontal: 10, paddingVertical: 4, marginTop: 4,
    },
    semSolucaoText: { fontSize: 12, fontWeight: '600', color: colors.semSolucaoText },

    // Serviços / Produtos
    itemCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 10, padding: 14, marginBottom: 10,
      borderWidth: 1, borderColor: colors.dividerSubtle,
    },
    itemTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
    itemRow: { flexDirection: 'row', marginBottom: 4 },
    itemLabel: { fontSize: 13, color: colors.textSecondary, width: 110, flexShrink: 0 },
    itemValue: { fontSize: 13, color: colors.textMeta, flex: 1, fontWeight: '500' },
  });

export default OrderDetailScreen;
