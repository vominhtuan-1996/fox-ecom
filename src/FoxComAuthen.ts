/**
 * Fox Commerce Authentication & Initialization
 *
 * Simplified entry point for integrating Fox eCommerce SDK
 *
 * Usage:
 *   const fox = new FoxComAuthen({
 *     token: 'your-token',
 *     environment: 'production',
 *     routing: { home: HomeScreen, products: ProductsScreen, ... },
 *     extra: { userId: '123', ... }
 *   });
 *
 *   // Everything is ready! Just use the app
 *   const { navigate, currentRoute } = fox.getNavigation();
 *   navigate('products');
 */

import { initializeApp } from './config/app.init';
import { setupAppRouting, getRouteInfo, buildRouteUrl, navigateTo } from './common/routing';
import { useAuth, useProducts, useCart, useNavigation } from '.';
import { Routing } from './common/routing';
import { sdkRouter } from './modules/navigation';

/**
 * Configuration for FoxComAuthen
 */
export interface FoxComAuthenConfig {
  /** Authentication token (required) */
  token: string;

  /** Environment: 'development', 'staging', 'production' */
  environment: 'development' | 'staging' | 'production';

  /** Custom screen routing (required) */
  routing: Record<string, React.ComponentType<any>>;

  /** Extra data (optional) */
  extra?: Record<string, any>;

  /** API base URL (optional) */
  apiBaseUrl?: string;

  /** Enable logging (optional) */
  enableLogging?: boolean;
}

/**
 * FoxComAuthen - Simplified SDK Entry Point
 *
 * One function to initialize everything:
 * - Authentication
 * - Routing & Navigation
 * - Products & Cart
 * - Dependency Injection
 */
export class FoxComAuthen {
  private initialized = false;
  private config: FoxComAuthenConfig;

  constructor(config: FoxComAuthenConfig) {
    if (!config.token) {
      throw new Error('❌ FoxComAuthen: token is required');
    }
    if (!config.routing || Object.keys(config.routing).length === 0) {
      throw new Error('❌ FoxComAuthen: routing screens are required');
    }

    this.config = config;
  }

  /**
   * Initialize SDK
   * Call this once when app starts
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('⚠️  FoxComAuthen already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing FoxComAuthen...');

      // 1. Initialize app with auth
      await initializeApp({
        token: this.config.token,
        environment: this.config.environment,
        apiBaseUrl: this.config.apiBaseUrl,
        enableLogging: this.config.enableLogging ?? true,
        extra: this.config.extra,
      });
      console.log('✅ Authentication initialized');

      // 2. Setup routing with custom screens
      await setupAppRouting(this.config.routing);
      console.log('✅ Routing initialized');

      // 3. Log all routes (if logging enabled)
      if (this.config.enableLogging) {
        console.log('📍 Available routes:');
        Routing.logAll();
      }

      this.initialized = true;
      console.log('✅ FoxComAuthen fully initialized!');
    } catch (error: any) {
      console.error('❌ FoxComAuthen initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Get navigation interface
   * Returns everything needed for navigation
   */
  getNavigation() {
    return {
      navigate: (routeName: string, params?: any) => navigateTo(routeName, params),
      useNavigation: () => useNavigation(),
      Routing,
      sdkRouter,
    };
  }

  /**
   * Get authentication interface
   * Returns everything needed for auth
   */
  getAuth() {
    return {
      useAuth: () => useAuth(),
      getRouteInfo,
    };
  }

  /**
   * Get products interface
   */
  getProducts() {
    return {
      useProducts: () => useProducts(),
    };
  }

  /**
   * Get cart interface
   */
  getCart() {
    return {
      useCart: () => useCart(),
    };
  }

  /**
   * Build URL with parameters
   */
  buildUrl(routeName: string, params?: any): string {
    return buildRouteUrl(routeName, params);
  }

  /**
   * Check if route exists
   */
  hasRoute(routeName: string): boolean {
    return Routing.exists(routeName as any);
  }

  /**
   * Get all available routes
   */
  getRoutes() {
    return Routing.getAll();
  }

  /**
   * Get initialization status
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get config
   */
  getConfig(): Readonly<FoxComAuthenConfig> {
    return Object.freeze({ ...this.config });
  }
}

export default FoxComAuthen;
