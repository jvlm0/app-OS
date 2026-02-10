import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchClients } from '../services/clientService';
import type { Client } from '../types/client.types';

const DEBOUNCE_MS = 500;

interface UseClientSearchReturn {
  clients: Client[];
  loading: boolean;
  loadingMore: boolean;
  hasSearched: boolean;
  canLoadMore: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loadMore: () => void;
}

export function useClientSearch(): UseClientSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Ref to avoid stale closure issues on loadMore
  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;

  const search = useCallback(async (query: string, page: number) => {
    if (!query.trim()) return;

    page === 1 ? setLoading(true) : setLoadingMore(true);
    setHasSearched(true);

    try {
      const data = await fetchClients({ query, page });

      setTotalPages(data.total_pages);
      setCurrentPage(page);
      setClients(prev => (page === 1 ? data.data : [...prev, ...data.data]));
    } catch (error) {
      console.error(error);
      if (page === 1) setClients([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounce: re-runs whenever searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setClients([]);
      setHasSearched(false);
      setCurrentPage(1);
      setTotalPages(1);
      return;
    }

    const timer = setTimeout(() => search(searchQuery, 1), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery, search]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || currentPage >= totalPages) return;
    search(searchQueryRef.current, currentPage + 1);
  }, [loadingMore, loading, currentPage, totalPages, search]);

  return {
    clients,
    loading,
    loadingMore,
    hasSearched,
    canLoadMore: currentPage < totalPages,
    searchQuery,
    setSearchQuery,
    loadMore,
  };
}