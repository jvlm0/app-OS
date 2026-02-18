// hooks/useOrderList.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { getOrders } from '../services/orderListService';
import type { Order } from '../types/order-list.types';

interface UseOrderListReturn {
  orders: Order[];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
  canLoadMore: boolean;
  loadMore: () => void;
  refresh: () => Promise<void>;
}

export function useOrderList(): UseOrderListReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Ref para evitar problemas de closure no loadMore
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  const fetchOrders = useCallback(async (page: number, isRefresh = false) => {
    if (page === 1) {
      isRefresh ? setRefreshing(true) : setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const result = await getOrders(page);

      if (!result.success) {
        setError(result.error || 'Erro ao carregar ordens');
        if (page === 1) setOrders([]);
      } else {
        setTotalPages(result.total_pages ?? 1);
        setCurrentPage(page);
        setOrders(prev => (page === 1 ? result.data ?? [] : [...prev, ...(result.data ?? [])]));
      }
    } catch (err) {
      console.error('Erro ao carregar ordens:', err);
      setError('Erro ao conectar com o servidor');
      if (page === 1) setOrders([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || currentPageRef.current >= totalPages) return;
    fetchOrders(currentPageRef.current + 1);
  }, [loadingMore, loading, totalPages, fetchOrders]);

  const refresh = useCallback(async () => {
    await fetchOrders(1, true);
  }, [fetchOrders]);

  return {
    orders,
    loading,
    loadingMore,
    refreshing,
    error,
    canLoadMore: currentPage < totalPages,
    loadMore,
    refresh,
  };
}