/**
 * App Initialization
 * Setup DI, services, and modules
 * Similar to Flutter's injector.dart setup
 */

import { di } from '@/di';
import { appConfig } from './app.config';
import { envConfig } from '@/common/config/env.config';

export async function initializeApp(overrideConfig?: Partial<typeof appConfig>) {
  try {
    console.log('🚀 Initializing App...');

    // 1. Setup configuration
    const finalConfig = { ...appConfig, ...overrideConfig };
    di.registerSingleton('appConfig', finalConfig);
    console.log('✅ Config registered');

    // 2. Setup environment config
    envConfig.set('apiBaseUrl', finalConfig.apiBaseUrl);
    envConfig.set('apiTimeout', finalConfig.apiTimeout);
    envConfig.set('environment', finalConfig.environment);
    envConfig.set('enableLogging', finalConfig.enableLogging);
    di.registerSingleton('envConfig', envConfig);
    console.log('✅ Environment config registered');

    // 3. Setup core services (will be added here)
    // - AuthService
    // - HttpClient
    // - StorageService
    // etc.

    // 4. Setup repositories (will be added here)
    // - AuthRepository
    // - ProductsRepository
    // etc.

    // 5. Setup modules (will be added here)
    // - AuthModule
    // - ProductsModule
    // etc.

    console.log('✅ App initialized successfully');
    return true;
  } catch (error: any) {
    console.error('❌ App initialization failed:', error.message);
    throw error;
  }
}

export function resetApp() {
  di.clear();
  console.log('🔄 App reset');
}

export default initializeApp;
