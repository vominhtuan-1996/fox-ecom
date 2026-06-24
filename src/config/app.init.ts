/**
 * App Initialization
 * Setup DI, services, and modules
 * Similar to Flutter's injector.dart setup
 */

import { di } from '@/di';
import { appConfig } from './app.config';
import { envConfig } from '@/common/config/env.config';
import { authService } from '@/modules/auth';
import { setupDependencies } from '@/di/injection';

export interface AppInitConfig {
  token?: string;
  environment?: 'development' | 'staging' | 'production';
  apiBaseUrl?: string;
  enableLogging?: boolean;
  extra?: Record<string, any>;
}

export async function initializeApp(overrideConfig?: AppInitConfig) {
  try {
    console.log('🚀 Initializing App...');

    // 1. Setup configuration
    const finalConfig = { ...appConfig };
    if (overrideConfig?.apiBaseUrl) finalConfig.apiBaseUrl = overrideConfig.apiBaseUrl;
    if (overrideConfig?.environment) finalConfig.environment = overrideConfig.environment;
    if (overrideConfig?.enableLogging !== undefined) finalConfig.enableLogging = overrideConfig.enableLogging;

    di.registerSingleton('appConfig', finalConfig);
    console.log('✅ App config registered');

    // 2. Setup environment config
    envConfig.set('apiBaseUrl', finalConfig.apiBaseUrl);
    envConfig.set('apiTimeout', finalConfig.apiTimeout);
    envConfig.set('environment', finalConfig.environment);
    envConfig.set('enableLogging', finalConfig.enableLogging);
    di.registerSingleton('envConfig', envConfig);
    console.log('✅ Environment config registered');

    // 3. Setup core services
    di.registerSingleton('authService', authService);
    console.log('✅ Auth service registered');

    // 4. Initialize auth if token provided
    if (overrideConfig?.token) {
      await authService.init({
        token: {
          accessToken: overrideConfig.token,
          tokenType: 'Bearer',
        },
        extra: overrideConfig.extra || {},
      });
      console.log('✅ Auth initialized');
    }

    // 5. Setup all dependencies (repositories, usecases, etc)
    setupDependencies();
    console.log('✅ All dependencies registered');

    console.log('✅ App initialized successfully');
    return true;
  } catch (error: any) {
    console.error('❌ App initialization failed:', error.message);
    throw error;
  }
}

export function resetApp() {
  di.clear();
  authService.logout();
  console.log('🔄 App reset');
}

export default initializeApp;
