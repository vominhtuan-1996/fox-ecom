/**
 * Routing Class
 * Centralized route declarations and management
 * (Similar to Flutter's route definitions)
 */

import { Route, ScreenName, RouteParams } from '@/modules/navigation';

/**
 * Route configuration for each screen
 */
export interface RouteDef {
  name: ScreenName;
  path: string;
  title?: string;
  description?: string;
}

/**
 * Routing Class - Declare all routes in one place
 */
export class Routing {
  /**
   * All route definitions
   */
  static readonly routes = {
    // Auth routes
    home: {
      name: 'home',
      path: '/home',
      title: 'Home',
      description: 'Home screen',
    } as RouteDef,

    login: {
      name: 'login',
      path: '/login',
      title: 'Login',
      description: 'Login screen',
    } as RouteDef,

    register: {
      name: 'register',
      path: '/register',
      title: 'Register',
      description: 'Registration screen',
    } as RouteDef,

    // Product routes
    products: {
      name: 'products',
      path: '/products',
      title: 'Products',
      description: 'Products list',
    } as RouteDef,

    productDetail: {
      name: 'product-detail',
      path: '/product-detail',
      title: 'Product Detail',
      description: 'Product detail screen',
    } as RouteDef,

    // Cart routes
    cart: {
      name: 'cart',
      path: '/cart',
      title: 'Shopping Cart',
      description: 'Shopping cart screen',
    } as RouteDef,

    checkout: {
      name: 'checkout',
      path: '/checkout',
      title: 'Checkout',
      description: 'Checkout screen',
    } as RouteDef,

    // Order routes
    orders: {
      name: 'orders',
      path: '/orders',
      title: 'My Orders',
      description: 'Orders list',
    } as RouteDef,

    orderDetail: {
      name: 'order-detail',
      path: '/order-detail',
      title: 'Order Detail',
      description: 'Order detail screen',
    } as RouteDef,

    // Profile routes
    profile: {
      name: 'profile',
      path: '/profile',
      title: 'Profile',
      description: 'User profile screen',
    } as RouteDef,

    settings: {
      name: 'settings',
      path: '/settings',
      title: 'Settings',
      description: 'Settings screen',
    } as RouteDef,

    // SDK initialization route
    foxecomsdk: {
      name: 'foxecomsdk',
      path: '/foxecomsdk',
      title: 'Fox eCommerce SDK',
      description: 'SDK initialization and app workflow',
    } as RouteDef,

    // Add more routes as needed
  };

  /**
   * Get all routes as array
   */
  static getAll(): RouteDef[] {
    return Object.values(this.routes);
  }

  /**
   * Get route by name
   */
  static getRoute(name: ScreenName): RouteDef | null {
    const route = this.routes[name as keyof typeof this.routes];
    return route || null;
  }

  /**
   * Get route path by name
   */
  static getPath(name: ScreenName): string | null {
    const route = this.getRoute(name);
    return route?.path || null;
  }

  /**
   * Get route title by name
   */
  static getTitle(name: ScreenName): string | null {
    const route = this.getRoute(name);
    return route?.title || null;
  }

  /**
   * Check if route exists
   */
  static exists(name: ScreenName): boolean {
    return this.getRoute(name) !== null;
  }

  /**
   * Build URL with params
   */
  static buildUrl(name: ScreenName, params?: RouteParams): string {
    const path = this.getPath(name);
    if (!path) return '';

    if (!params || Object.keys(params).length === 0) {
      return path;
    }

    const queryString = Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    return queryString ? `${path}?${queryString}` : path;
  }

  /**
   * Get all routes with component mapping
   * Used with sdkRouter.registerRoutes()
   */
  static getRoutesWithComponents(componentMap: Record<ScreenName, any>): Route[] {
    return this.getAll().map((route) => ({
      ...route,
      component: componentMap[route.name],
    }));
  }

  /**
   * Get navigation options for a route
   */
  static getNavOptions(name: ScreenName) {
    const route = this.getRoute(name);
    if (!route) return null;

    return {
      title: route.title,
      description: route.description,
    };
  }

  /**
   * Add custom route (for extensions)
   */
  static addRoute(route: RouteDef): void {
    (this.routes as any)[route.name] = route;
  }

  /**
   * Get all route names
   */
  static getRouteNames(): ScreenName[] {
    return this.getAll().map((r) => r.name);
  }

  /**
   * Log all routes (debugging)
   */
  static logAll(): void {
    console.log('📍 All Routes:');
    this.getAll().forEach((route) => {
      console.log(`  - ${route.name}: ${route.path}${route.title ? ` (${route.title})` : ''}`);
    });
  }
}

export default Routing;
