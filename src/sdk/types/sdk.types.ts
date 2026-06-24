/**
 * SDK Configuration and Types
 */

import { AuthToken, AuthExtra } from '@/common/types/auth.types';

export interface SDKAuthConfig {
  token: AuthToken;
  extra?: AuthExtra;
}

export interface SDKConfig {
  apiBaseUrl: string;
  apiTimeout?: number;
  environment?: 'development' | 'staging' | 'production';
  auth: SDKAuthConfig;
}

export interface SDKInitOptions {
  apiBaseUrl: string;
  apiTimeout?: number;
  environment?: 'development' | 'staging' | 'production';
  token: string | AuthToken;
  extra?: AuthExtra;
  deviceId?: string;
  userId?: string;
}

export interface SDKState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  config: SDKConfig | null;
  error: string | null;
}

export interface SDKInstance {
  // State
  isInitialized(): boolean;
  isAuthenticated(): boolean;
  getConfig(): SDKConfig | null;
  getState(): SDKState;

  // Auth
  getToken(): string | null;
  getAccessToken(): string | null;
  setExtra(key: string, value: any): void;
  getExtra(key?: string): any;

  // Refresh
  refreshAuth(): Promise<boolean>;
  logout(): Promise<void>;

  // Utils
  getVersion(): string;
  getEnvironment(): string;
}
