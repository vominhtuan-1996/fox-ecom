/**
 * App Context - Per-app isolated configuration
 */

export interface AppContextConfig {
  appId: string;
  token: string;
  environment: 'development' | 'staging' | 'production';
  scheme: 'http' | 'https';
  domain?: string;
  extra?: Record<string, any>;
}

export interface AppContext {
  appId: string;
  token: string;
  environment: string;
  scheme: string;
  apiDomain: string;
  apiBaseUrl: string;
  extra: Record<string, any>;
  isValid: boolean;
  createdAt: number;
  expiresAt?: number;
}

/**
 * Build API domain từ config
 */
export function buildApiDomain(config: AppContextConfig): string {
  if (config.domain) {
    return config.domain;
  }

  // Default domain building logic
  const env = config.environment === 'production' ? '' : `-${config.environment}`;
  return `${config.scheme}://api${env}.foxecom.com`;
}

/**
 * Tạo App Context
 */
export function createAppContext(config: AppContextConfig): AppContext {
  const apiDomain = buildApiDomain(config);

  return {
    appId: config.appId,
    token: config.token,
    environment: config.environment,
    scheme: config.scheme,
    apiDomain,
    apiBaseUrl: apiDomain,
    extra: config.extra || {},
    isValid: true,
    createdAt: Date.now(),
  };
}

/**
 * Validate App Context
 */
export function validateAppContext(context: AppContext): boolean {
  if (!context.appId || !context.token) {
    return false;
  }

  // Check if expired
  if (context.expiresAt && Date.now() > context.expiresAt) {
    return false;
  }

  return context.isValid;
}
