/**
 * Authentication types
 */

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}

export type AuthState = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthSession {
  user: AuthUser;
  token: AuthToken;
  issuedAt: number;
  expiresAt?: number;
}

export interface AuthExtra {
  [key: string]: any;
}

export interface AuthConfig {
  credentials: AuthCredentials;
  token: AuthToken;
  extra?: AuthExtra;
  deviceId?: string;
  userAgent?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: AuthToken;
  extra?: AuthExtra;
  message?: string;
  error?: string;
}

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
  [key: string]: any;
}
