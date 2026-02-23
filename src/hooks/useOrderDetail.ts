// hooks/useOrderDetail.ts
// Hook para buscar os detalhes de uma ordem de serviço

import { useCallback, useEffect, useState } from 'react';
import { getOrderDetail } from '../services/orderDetailService';
import type { Order } from '../types/order-list.types';

interface UseOrderDetailReturn {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useOrderDetail(cod_ordem: number): UseOrderDetailReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getOrderDetail(cod_ordem);

      if (!result.success) {
        setError(result.error || 'Erro ao carregar ordem');
        setOrder(null);
      } else {
        setOrder(result.data ?? null);
      }
    } catch (err) {
      console.error('Erro ao buscar ordem:', err);
      setError('Erro ao conectar com o servidor');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [cod_ordem]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    refresh: fetchOrder,
  };
}