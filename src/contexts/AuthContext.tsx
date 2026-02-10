// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import type { AuthState, LoginCredentials } from '../types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  renewToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    usuario: null,
    isLoading: true,
  });

  // Verificar se há sessão salva ao iniciar o app
  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const { accessToken, refreshToken, usuario } = await authService.getStoredAuthData();

      if (accessToken && refreshToken && usuario) {
        // Verificar se o token ainda é válido tentando renovar
        const refreshResult = await authService.refreshAccessToken();

        if (refreshResult.success) {
          setAuthState({
            isAuthenticated: true,
            accessToken: refreshResult.data!.access_token,
            refreshToken,
            usuario,
            isLoading: false,
          });
        } else {
          // Token expirado, fazer logout
          await authService.logout();
          setAuthState({
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            usuario: null,
            isLoading: false,
          });
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await authService.login(credentials);

      if (result.success && result.data) {
        setAuthState({
          isAuthenticated: true,
          accessToken: result.data.access_token,
          refreshToken: result.data.refresh_token,
          usuario: result.data.usuario,
          isLoading: false,
        });

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      usuario: null,
      isLoading: false,
    });
  };

  const renewToken = async (): Promise<boolean> => {
    try {
      const result = await authService.refreshAccessToken();

      if (result.success && result.data) {
        setAuthState(prev => ({
          ...prev,
          accessToken: result.data!.access_token,
        }));
        return true;
      } else {
        // Se falhou ao renovar, fazer logout
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      await logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        renewToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};