/**
 * Auth Types
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

export interface AuthSession {
  user?: AuthUser;
  token: AuthToken;
  issuedAt: number;
  expiresAt?: number;
}

export interface AuthExtra {
  [key: string]: any;
}

export type AuthState = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
