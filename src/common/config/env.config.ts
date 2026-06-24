/**
 * Environment configuration
 */

export interface EnvConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
  appVersion: string;
  environment: 'development' | 'staging' | 'production';
}

class EnvironmentConfig {
  private config: EnvConfig;

  constructor() {
    this.config = {
      apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.foxecom.com',
      apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10),
      enableLogging: process.env.REACT_APP_ENABLE_LOGGING === 'true',
      appVersion: process.env.REACT_APP_VERSION || '0.1.0',
      environment: (process.env.REACT_APP_ENV || 'production') as any,
    };
  }

  getConfig(): EnvConfig {
    return { ...this.config };
  }

  get(key: keyof EnvConfig) {
    return this.config[key];
  }

  set<K extends keyof EnvConfig>(key: K, value: EnvConfig[K]) {
    this.config[key] = value;
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }
}

export const envConfig = new EnvironmentConfig();
