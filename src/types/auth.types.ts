// types/auth.types.ts
// Tipos e interfaces relacionados à autenticação

/**
 * Credenciais de login
 */
export interface LoginCredentials {
  username: string;
  senha: string;
}

/**
 * Resposta da API de login
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  usuario: string;
}

/**
 * Resultado da tentativa de login
 */
export interface LoginResult {
  success: boolean;
  data?: LoginResponse;
  error?: string;
}

/**
 * Resposta da API de refresh token
 */
export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
}

/**
 * Resultado do refresh token
 */
export interface RefreshTokenResult {
  success: boolean;
  data?: RefreshTokenResponse;
  error?: string;
}

/**
 * Estado de autenticação
 */
export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  usuario: string | null;
  isLoading: boolean;
}