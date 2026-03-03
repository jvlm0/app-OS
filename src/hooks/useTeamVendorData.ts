// src/hooks/useTeamVendorData.ts

import { fetchEquipes, fetchVendedores } from '@/services/teamVendorService';
import type { Equipe, Vendedor } from '@/types/team-vendor.types';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UseTeamVendorDataOptions {
  /** Passa `true` para não buscar equipes (ex.: AddProductScreen) */
  skipEquipes?: boolean;
}

interface UseTeamVendorDataResult {
  equipes: Equipe[];
  vendedores: Vendedor[];
  isLoading: boolean;
}

/**
 * Carrega equipes e vendedores da API.
 *
 * Use `skipEquipes: true` quando a tela não precisar de equipes
 * (ex.: AddProductScreen), evitando a requisição desnecessária.
 */
export function useTeamVendorData(
  options: UseTeamVendorDataOptions = {},
): UseTeamVendorDataResult {
  const { skipEquipes = false } = options;

  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      const requests: [
        Promise<{ success: boolean; data?: Equipe[]; error?: string }>,
        Promise<{ success: boolean; data?: Vendedor[]; error?: string }>,
      ] = [
        skipEquipes ? Promise.resolve({ success: true, data: [] }) : fetchEquipes(),
        fetchVendedores(),
      ];

      const [equipesResult, vendedoresResult] = await Promise.all(requests);

      if (!skipEquipes) {
        if (equipesResult.success && equipesResult.data) {
          setEquipes(equipesResult.data);
        } else {
          Alert.alert('Atenção', equipesResult.error || 'Não foi possível carregar as equipes.');
        }
      }

      if (vendedoresResult.success && vendedoresResult.data) {
        setVendedores(vendedoresResult.data);
      } else {
        Alert.alert('Atenção', vendedoresResult.error || 'Não foi possível carregar os vendedores.');
      }

      setIsLoading(false);
    };

    loadData();
  }, [skipEquipes]);

  return { equipes, vendedores, isLoading };
}
