/**
 * SDK Factory
 * Initialize SDK with authentication
 */

import { authService } from '@/domain/services/auth.service';
import { envConfig } from '@/common/config/env.config';
import { AuthToken, AuthExtra } from '@/common/types/auth.types';
import { SDKConfig, SDKInitOptions, SDKState, SDKInstance } from '@/sdk/types/sdk.types';

class SDKFactoryImpl implements SDKInstance {
  private static instance: SDKFactoryImpl;
  private config: SDKConfig | null = null;
  private _isInitialized: boolean = false;
  private error: string | null = null;

  private constructor() {}

  static getInstance(): SDKFactoryImpl {
    if (!SDKFactoryImpl.instance) {
      SDKFactoryImpl.instance = new SDKFactoryImpl();
    }
    return SDKFactoryImpl.instance;
  }

  /**
   * Initialize SDK with authentication
   */
  async init(options: SDKInitOptions): Promise<void> {
    try {
      this.validateOptions(options);

      // Prepare auth config
      const token = this.prepareToken(options.token);
      const extra = this.prepareExtra(options);

      // Initialize environment
      this.initializeEnvironment(options);

      // Initialize auth service
      await authService.init({
        token,
        extra,
      });

      // Set config
      this.config = {
        apiBaseUrl: options.apiBaseUrl,
        apiTimeout: options.apiTimeout || 10000,
        environment: options.environment || 'production',
        auth: {
          token,
          extra,
        },
      };

      this._isInitialized = true;
      this.error = null;

      console.log('✅ SDK initialized successfully', {
        environment: options.environment,
        hasAuth: !!token.accessToken,
      });
    } catch (err: any) {
      this.error = err.message;
      this._isInitialized = false;
      console.error('❌ SDK initialization failed:', err.message);
      throw new Error(`SDK Initialization Error: ${err.message}`);
    }
  }

  /**
   * Reset SDK
   */
  reset(): void {
    this.config = null;
    this._isInitialized = false;
    this.error = null;
    authService.logout();
  }

  /**
   * State methods
   */
  isInitialized(): boolean {
    return this._isInitialized;
  }

  isAuthenticated(): boolean {
    return this._isInitialized && authService.isAuthenticated();
  }

  getConfig(): SDKConfig | null {
    return this.config;
  }

  getState(): SDKState {
    return {
      isInitialized: this._isInitialized,
      isAuthenticated: this.isAuthenticated(),
      config: this.config,
      error: this.error,
    };
  }

  /**
   * Auth methods
   */
  getToken(): string | null {
    if (!this._isInitialized) {
      throw new Error('SDK not initialized');
    }
    const token = authService.getToken();
    return token ? JSON.stringify(token) : null;
  }

  getAccessToken(): string | null {
    if (!this._isInitialized) {
      throw new Error('SDK not initialized');
    }
    return authService.getAccessToken();
  }

  setExtra(key: string, value: any): void {
    if (!this._isInitialized) {
      throw new Error('SDK not initialized');
    }
    authService.setExtra(key, value);
    if (this.config?.auth.extra) {
      this.config.auth.extra[key] = value;
    }
  }

  getExtra(key?: string): any {
    if (!this._isInitialized) {
      throw new Error('SDK not initialized');
    }
    return authService.getExtra(key);
  }

  /**
   * Refresh auth
   */
  async refreshAuth(): Promise<boolean> {
    if (!this._isInitialized) {
      throw new Error('SDK not initialized');
    }
    return authService.refreshToken();
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (!this._isInitialized) {
      throw new Error('SDK not initialized');
    }
    await authService.logout();
    this.reset();
  }

  /**
   * Utilities
   */
  getVersion(): string {
    return String(envConfig.get('appVersion'));
  }

  getEnvironment(): string {
    return this.config?.environment || 'unknown';
  }

  /**
   * Private methods
   */
  private validateOptions(options: SDKInitOptions): void {
    if (!options.apiBaseUrl) {
      throw new Error('apiBaseUrl is required');
    }

    if (!options.token) {
      throw new Error('token is required');
    }

    const tokenStr = typeof options.token === 'string' ? options.token : options.token.accessToken;
    if (!tokenStr) {
      throw new Error('token.accessToken is required');
    }
  }

  private prepareToken(token: string | AuthToken): AuthToken {
    if (typeof token === 'string') {
      return {
        accessToken: token,
        tokenType: 'Bearer',
      };
    }
    return token;
  }

  private prepareExtra(options: SDKInitOptions): AuthExtra {
    const extra: AuthExtra = options.extra || {};

    // Add standard fields
    if (options.deviceId) {
      extra.deviceId = options.deviceId;
    }
    if (options.userId) {
      extra.userId = options.userId;
    }

    return extra;
  }

  private initializeEnvironment(options: SDKInitOptions): void {
    envConfig.set('apiBaseUrl', options.apiBaseUrl);
    if (options.apiTimeout) {
      envConfig.set('apiTimeout', options.apiTimeout);
    }
    if (options.environment) {
      envConfig.set('environment', options.environment);
    }
  }
}

/**
 * Initialize SDK with authentication
 * This is the main entry point
 */
export async function initSDK(options: SDKInitOptions): Promise<SDKInstance> {
  const factory = SDKFactoryImpl.getInstance();
  await factory.init(options);
  return factory;
}

/**
 * Get SDK instance (must call initSDK first)
 */
export function getSDK(): SDKInstance {
  const factory = SDKFactoryImpl.getInstance();
  if (!factory.isInitialized()) {
    throw new Error('SDK not initialized. Call initSDK() first.');
  }
  return factory;
}

/**
 * Reset SDK
 */
export function resetSDK(): void {
  SDKFactoryImpl.getInstance().reset();
}

export const sdkFactory = SDKFactoryImpl.getInstance();
