// src/hooks/useServiceForm.ts — versão completa atualizada com problemas

import type { ProductData } from '@/components/service-form/ReadOnlyProductCard';
import { ServiceData } from '@/components/service-form/ReadOnlyServiceCard';
import { useFormData } from '@/contexts/FormDataContext';
import { createOrder, updateOrder } from '@/services/orderService';
import type { RootStackParamList } from '@/types/navigation.types';
import type { Order } from '@/types/order-list.types';
import type { ItemProdutoCreate, ProblemaOrdem, ServicoCreate } from '@/types/order.types';
import type { ProblemaData } from '@/types/problema.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface Service {
  id: string;
  description: string;
  quantity: string;
  unitValue: string;
}

interface UseServiceFormProps {
  order?: Order;
  navigation: NativeStackNavigationProp<RootStackParamList, 'ServiceForm'>;
}

export const useServiceForm = ({ order, navigation }: UseServiceFormProps) => {
  const {
    selectedClient,
    selectedVehicle,
    setSelectedClient,
    setSelectedVehicle,
    services,
    setServices,
    products,
    setProducts,
    problemas,
    setProblemas,
    removeProblema,
    removedServiceIds,
    removedProductIds,
    setUpdatedOrder,
    clearFormData,
  } = useFormData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [problemasExpanded, setProblemasExpanded] = useState(false);

  useEffect(() => {
    clearFormData();

    if (order) {
      setIsEditMode(true);
      setTitle(order.titulo ?? '');
      setDescription(order.descricao ?? '');

      setSelectedClient({
        COD_PESSOA: order.cliente.COD_PESSOA,
        nome: order.cliente.nome ?? '',
        telefone: order.cliente.telefone ?? '',
        cpfcnpj: order.cliente.cpfcnpj,
      });

      setSelectedVehicle({
        cod_veiculo: order.veiculo.cod_veiculo,
        plate: order.veiculo.placa ?? '',
        modelo: order.veiculo.modelo ?? '',
        ano: order.veiculo.ano ?? '',
        mileage: order.veiculo.kmatual != null ? order.veiculo.kmatual.toString() : '',
      });

      if (order.servicos && order.servicos.length > 0) {
        const mappedServices: ServiceData[] = order.servicos.map(s => ({
          id: `api-${s.cod_servico}`,
          cod_servico: s.cod_servico,
          descricao: s.descricao,
          quantidade: s.quantidade,
          valorUnitario: s.valorUnitario,
          desconto: s.desconto,
          cod_equipe: s.equipe.cod_equipe,
          equipe: s.equipe.nome,
          vendedores: s.vendedores.map(v => v.nome),
          cod_vendedores: s.vendedores.map(v => v.cod_vendedor),
        }));
        setServices(mappedServices);
        setServicesExpanded(true);
      }

      if (order.produtos && order.produtos.length > 0) {
        const mappedProducts: ProductData[] = order.produtos.map(p => ({
          id: `api-${p.cod_itemProduto}`,
          cod_itemProduto: p.cod_itemProduto,
          cod_subproduto: p.cod_itemProduto,
          nomeProduto: p.nome,
          quantidade: Number(p.quantidade),
          valorUnitario: Number(p.valorUnitario),
          desconto: Number(p.desconto),
          vendedores: p.vendedores.map(v => v.nome),
          cod_vendedores: p.vendedores.map(v => v.cod_vendedor),
        }));
        setProducts(mappedProducts);
        setProductsExpanded(true);
      }

      // ── Popula problemas vindos da API ────────────────────────────────────
      if (order.problemas && order.problemas.length > 0) {
        const mappedProblemas: ProblemaData[] = order.problemas.map((p, i) => ({
          id: `api-problema-${i}-${Date.now()}`,
          descricao: p.descricao,
          solucao: p.solucao,
        }));
        setProblemas(mappedProblemas);
        setProblemasExpanded(true);
      }
    } else {
      setIsEditMode(false);
      setTitle('');
      setDescription('');
    }

    return () => {
      clearFormData();
    };
  }, [order]);

  // ─── Navegação ────────────────────────────────────────────────────────────

  const handleClientSelect = () => navigation.navigate('ClientSearch');
  const handleAddClient = () => navigation.navigate('ClientForm');

  const handleVehicleAdd = () => {
    if (!selectedClient) {
      Alert.alert('Atenção', 'Selecione um cliente antes de adicionar um veículo', [
        { text: 'OK' },
      ]);
      return;
    }
    navigation.navigate('CameraScreen', { cod_cliente: selectedClient.COD_PESSOA });
  };

  // ─── Mapeamento de problemas para payload ─────────────────────────────────

  const mapProblemasToPayload = (problemaList: ProblemaData[]): ProblemaOrdem[] =>
    problemaList.map(p => ({
      descricao: p.descricao,
      solucao: p.solucao || undefined,
    }));

  // ─── Mapeamento de serviços (apenas novos) ────────────────────────────────

  const mapNewServicesToPayload = (serviceList: ServiceData[]): ServicoCreate[] =>
    serviceList
      .filter(s => s.cod_servico == null)
      .map(s => ({
        descricao: s.descricao,
        quantidade: s.quantidade,
        valorUnitario: s.valorUnitario,
        desconto: s.desconto ?? 0,
        cod_equipe: s.cod_equipe,
        cods_vendedores: s.cod_vendedores,
      }));

  const mapNewProductsToPayload = (productList: ProductData[]): ItemProdutoCreate[] =>
    productList
      .filter(p => p.cod_itemProduto == null)
      .map(p => ({
        cod_subproduto: p.cod_subproduto,
        quantidade: p.quantidade,
        valorUnitario: p.valorUnitario,
        desconto: p.desconto ?? 0,
        cods_vendedores: p.cod_vendedores,
      }));

  const mapServicesToPayload = (serviceList: ServiceData[]): ServicoCreate[] =>
    serviceList.map(s => ({
      descricao: s.descricao,
      quantidade: s.quantidade,
      valorUnitario: s.valorUnitario,
      desconto: s.desconto ?? 0,
      cod_equipe: s.cod_equipe,
      cods_vendedores: s.cod_vendedores,
    }));

  const mapProductsToPayload = (productList: ProductData[]): ItemProdutoCreate[] =>
    productList.map(p => ({
      cod_subproduto: p.cod_subproduto,
      quantidade: p.quantidade,
      valorUnitario: p.valorUnitario,
      desconto: p.desconto ?? 0,
      cods_vendedores: p.cod_vendedores,
    }));

  const updateService = (_id: string, _field: keyof Service, _value: string) => {};

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  // ─── Validação ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'O título é obrigatório');
      return false;
    }
    if (!selectedClient) {
      Alert.alert('Atenção', 'Selecione um cliente');
      return false;
    }
    if (!selectedVehicle) {
      Alert.alert('Atenção', 'Adicione um veículo');
      return false;
    }
    if (!selectedVehicle.cod_veiculo) {
      Alert.alert(
        'Erro',
        'O veículo não possui um código válido. Por favor, cadastre o veículo novamente.',
        [{ text: 'OK' }],
      );
      return false;
    }
    return true;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEditMode && order) {
        await handleUpdate(order.cod_ordem);
      } else {
        await handleCreate();
      }
    } catch (error) {
      console.error('Erro ao salvar ordem:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a ordem de serviço. Tente novamente.', [
        { text: 'OK' },
      ]);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (cod_ordem: number) => {
    const newServices = mapNewServicesToPayload(services);
    const newProducts = mapNewProductsToPayload(products);
    // Problemas: envia lista completa (conforme spec da API)
    const problemaPayload = problemas.length > 0 ? mapProblemasToPayload(problemas) : undefined;

    const result = await updateOrder({
      cod_ordem,
      titulo: title.trim(),
      descricao: description.trim() || '',
      cod_veiculo: selectedVehicle!.cod_veiculo!,
      cod_cliente: selectedClient!.COD_PESSOA,
      servicos: newServices.length > 0 ? newServices : undefined,
      produtos: newProducts.length > 0 ? newProducts : undefined,
      servicosRemovidos: removedServiceIds.length > 0 ? removedServiceIds : undefined,
      produtosRemovidos: removedProductIds.length > 0 ? removedProductIds : undefined,
      problemas: problemaPayload,
    });

    if (!result.success) {
      Alert.alert(
        'Erro ao atualizar',
        result.error || 'Não foi possível atualizar a ordem de serviço. Tente novamente.',
        [{ text: 'OK' }],
      );
      return;
    }

    Alert.alert('Sucesso!', `Ordem de serviço #${cod_ordem} atualizada com sucesso!`, [
      {
        text: 'OK',
        onPress: () => {
          setUpdatedOrder(result.data!);
          clearFormData();
          navigation.goBack();
        },
      },
    ]);
  };

  const handleCreate = async () => {
    const problemaPayload = problemas.length > 0 ? mapProblemasToPayload(problemas) : undefined;

    const result = await createOrder({
      titulo: title.trim(),
      descricao: description.trim() || '',
      cod_veiculo: selectedVehicle!.cod_veiculo!,
      cod_cliente: selectedClient!.COD_PESSOA,
      servicos: services.length > 0 ? mapServicesToPayload(services) : undefined,
      produtos: products.length > 0 ? mapProductsToPayload(products) : undefined,
      problemas: problemaPayload,
    });

    if (!result.success) {
      Alert.alert(
        'Erro ao salvar',
        result.error || 'Não foi possível salvar a ordem de serviço. Tente novamente.',
        [{ text: 'OK' }],
      );
      return;
    }

    Alert.alert(
      'Sucesso!',
      `Ordem de serviço #${result.data!.cod_ordem} criada com sucesso!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            setDescription('');
            clearFormData();
            navigation.goBack();
          },
        },
      ],
    );
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    saving,
    isEditMode,
    selectedClient,
    selectedVehicle,
    services,
    servicesExpanded,
    setServicesExpanded,
    products,
    productsExpanded,
    setProductsExpanded,
    problemas,
    problemasExpanded,
    setProblemasExpanded,
    removeProblema,
    detailsExpanded,
    setDetailsExpanded,
    updateService,
    formatCurrency,
    handleClientSelect,
    handleAddClient,
    handleVehicleAdd,
    handleSave,
  };
};