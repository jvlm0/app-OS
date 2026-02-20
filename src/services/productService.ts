// src/services/productService.ts

import type { FetchParams, PaginatedResponse } from '@/hooks/useGenericSearch';
import type { Product } from '@/types/product.types';
import { api } from '../utils/apiClient';

export async function fetchProducts({
  query,
  page,
  pageSize = 20,
}: FetchParams): Promise<PaginatedResponse<Product>> {
  try {
    const url = `/produtos?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`;
    const response = await api.get(url);

    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return { page: 0, page_size: 0, total_pages: 0, data: [] };
  }
}