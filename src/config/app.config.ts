/**
 * App Configuration
 * Centralized app settings
 */

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
}

export const appConfig: AppConfig = {
  name: 'Fox eCommerce SDK',
  version: process.env.REACT_APP_VERSION || '0.1.0',
  environment: (process.env.REACT_APP_ENV as any) || 'development',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.foxecom.com',
  apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  enableLogging: process.env.REACT_APP_ENABLE_LOGGING === 'true',
};

export default appConfig;
