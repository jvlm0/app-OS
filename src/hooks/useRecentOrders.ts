// src/hooks/useRecentOrders.ts
import { useCallback, useState } from 'react';
import { getOrders } from '../services/orderListService';
import type { Order } from '../types/order-list.types';

const PAGE_SIZE = 5;

interface UseRecentOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRecentOrders(): UseRecentOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrders(1, PAGE_SIZE);
      if (result.success) {
        setOrders(result.data ?? []);
      } else {
        setError(result.error ?? 'Erro ao carregar ordens recentes');
      }
    } catch {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, loading, error, refresh };
}
