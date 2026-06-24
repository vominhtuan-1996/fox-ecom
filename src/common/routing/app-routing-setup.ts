/**
 * App Routing Setup
 * Initialize routing and screens for the app
 * Call this once when app starts
 */

import { Routing, ScreenRegistry } from './index';
import { sdkRouter } from '@/modules/navigation';
import { ScreenComponent } from './screen-registry';

/**
 * Setup routing for the app
 * This should be called once in app initialization
 */
export async function setupAppRouting(screenComponents: Record<string, ScreenComponent>): Promise<void> {
  try {
    console.log('🗺️ Setting up app routing...');

    // 1. Register screens
    ScreenRegistry.registerMultiple(screenComponents as any);
    console.log(`✅ Registered ${ScreenRegistry.count()} screens`);

    // 2. Build routes with components
    const allScreens = ScreenRegistry.getAll();
    const routes = Routing.getRoutesWithComponents(allScreens as any);
    console.log(`✅ Built ${routes.length} routes`);

    // 3. Register with navigation
    sdkRouter.registerRoutes(routes);
    console.log(`✅ Routes registered with sdkRouter`);

    // 4. Log for debugging
    if (process.env.NODE_ENV === 'development') {
      Routing.logAll();
    }

    console.log('✅ App routing setup complete');
  } catch (error: any) {
    console.error('❌ App routing setup failed:', error.message);
    throw error;
  }
}

/**
 * Get a screen by route name
 */
export function getScreen(routeName: string): ScreenComponent | null {
  return ScreenRegistry.getScreen(routeName as any);
}

/**
 * Navigate to a route
 */
export function navigateTo(routeName: string, params?: Record<string, any>): boolean {
  // Check if route exists
  if (!Routing.exists(routeName as any)) {
    console.error(`❌ Route not found: ${routeName}`);
    return false;
  }

  // Navigate
  return sdkRouter.navigate(routeName as any, params);
}

/**
 * Get route info
 */
export function getRouteInfo(routeName: string) {
  return Routing.getRoute(routeName as any);
}

/**
 * Build URL with params
 */
export function buildRouteUrl(routeName: string, params?: Record<string, any>): string {
  return Routing.buildUrl(routeName as any, params);
}

export default setupAppRouting;
