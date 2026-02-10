// services/authService.ts
// Serviço para gerenciar autenticação

import { ENV } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginCredentials, LoginResult, RefreshTokenResult } from '../types/auth.types';

const API_BASE_URL = ENV.API_URL;

// Chaves para o AsyncStorage
const STORAGE_KEYS = {
  ACCESS_TOKEN: '@auth:access_token',
  REFRESH_TOKEN: '@auth:refresh_token',
  USUARIO: '@auth:usuario',
};

/**
 * Realiza o login do usuário
 * @param credentials - Credenciais do usuário
 * @returns Resultado do login
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || 'Usuário ou senha incorretos',
      };
    }

    const data = await response.json();

    // Salvar tokens no AsyncStorage
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, data.access_token],
      [STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token],
      [STORAGE_KEYS.USUARIO, data.usuario],
    ]);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};

/**
 * Atualiza o access token usando o refresh token
 * @returns Novo access token
 */
export const refreshAccessToken = async (): Promise<RefreshTokenResult> => {
  try {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      return {
        success: false,
        error: 'Refresh token não encontrado',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Sessão expirada',
      };
    }

    const data = await response.json();

    // Atualizar access token no AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return {
      success: false,
      error: 'Erro ao renovar sessão',
    };
  }
};

/**
 * Realiza o logout do usuário
 */
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USUARIO,
    ]);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

/**
 * Recupera os dados de autenticação salvos
 */
export const getStoredAuthData = async () => {
  try {
    const values = await AsyncStorage.multiGet([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USUARIO,
    ]);

    return {
      accessToken: values[0][1],
      refreshToken: values[1][1],
      usuario: values[2][1],
    };
  } catch (error) {
    console.error('Erro ao recuperar dados de autenticação:', error);
    return {
      accessToken: null,
      refreshToken: null,
      usuario: null,
    };
  }
};

/**
 * Obtém o access token atual
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Erro ao obter access token:', error);
    return null;
  }
};