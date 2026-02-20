// src/hooks/useGenericSearch.ts

import { useCallback, useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS = 500;

export interface PaginatedResponse<T> {
  page: number;
  page_size: number;
  total_pages: number;
  data: T[];
}

export interface FetchParams {
  query: string;
  page: number;
  pageSize?: number;
}

export type FetchFn<T> = (params: FetchParams) => Promise<PaginatedResponse<T>>;

export interface UseGenericSearchReturn<T> {
  items: T[];
  loading: boolean;
  loadingMore: boolean;
  hasSearched: boolean;
  canLoadMore: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loadMore: () => void;
}

export function useGenericSearch<T>(fetchFn: FetchFn<T>): UseGenericSearchReturn<T> {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;

  const search = useCallback(
    async (query: string, page: number) => {
      if (!query.trim()) return;

      page === 1 ? setLoading(true) : setLoadingMore(true);
      setHasSearched(true);

      try {
        const data = await fetchFn({ query, page });
        setTotalPages(data.total_pages);
        setCurrentPage(page);
        setItems(prev => (page === 1 ? data.data : [...prev, ...data.data]));
      } catch (error) {
        console.error(error);
        if (page === 1) setItems([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchFn],
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setItems([]);
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
    items,
    loading,
    loadingMore,
    hasSearched,
    canLoadMore: currentPage < totalPages,
    searchQuery,
    setSearchQuery,
    loadMore,
  };
}