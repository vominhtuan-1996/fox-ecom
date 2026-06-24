/**
 * SDK Router Service
 * Handle navigation and routing
 */

import { Route, ScreenName, RouteParams, NavigationState, RouterConfig } from './types';

type NavigationListener = (state: NavigationState) => void;

class SDKRouter {
  private static instance: SDKRouter;
  private routes: Map<ScreenName, Route> = new Map();
  private state: NavigationState = {
    currentRoute: null,
    previousRoute: null,
    params: {},
    history: [],
  };
  private listeners: Set<NavigationListener> = new Set();

  private constructor() {}

  static getInstance(): SDKRouter {
    if (!SDKRouter.instance) {
      SDKRouter.instance = new SDKRouter();
    }
    return SDKRouter.instance;
  }

  /**
   * Register routes
   */
  registerRoutes(routes: Route[]): void {
    routes.forEach((route) => {
      this.routes.set(route.name, route);
    });
    console.log('📍 Routes registered:', routes.map((r) => r.name));
  }

  /**
   * Navigate to screen
   */
  navigate(screenName: ScreenName, params?: RouteParams): boolean {
    const route = this.routes.get(screenName);

    if (!route) {
      console.error('❌ Route not found:', screenName);
      return false;
    }

    // Update state
    this.state.previousRoute = this.state.currentRoute;
    this.state.currentRoute = screenName;
    this.state.params = params || {};

    // Add to history
    if (!this.state.history.includes(screenName)) {
      this.state.history.push(screenName);
    }

    // Notify listeners
    this.notifyListeners();

    console.log('📍 Navigated to:', screenName, { params });
    return true;
  }

  /**
   * Navigate back
   */
  goBack(): boolean {
    if (this.state.history.length <= 1) {
      console.log('⚠️ No previous route');
      return false;
    }

    // Pop current route
    this.state.history.pop();
    const previousRoute = this.state.history[this.state.history.length - 1];

    if (previousRoute) {
      this.state.previousRoute = this.state.currentRoute;
      this.state.currentRoute = previousRoute;
      this.state.params = {};

      this.notifyListeners();
      console.log('📍 Navigated back to:', previousRoute);
      return true;
    }

    return false;
  }

  /**
   * Get current route
   */
  getCurrentRoute(): ScreenName | null {
    return this.state.currentRoute;
  }

  /**
   * Get route params
   */
  getParams(): RouteParams {
    return { ...this.state.params };
  }

  /**
   * Get route component
   */
  getRouteComponent(screenName?: ScreenName): React.ComponentType<any> | null {
    const name = screenName || this.state.currentRoute;
    if (!name) return null;

    const route = this.routes.get(name);
    return route?.component || null;
  }

  /**
   * Get route by name
   */
  getRoute(screenName: ScreenName): Route | null {
    return this.routes.get(screenName) || null;
  }

  /**
   * Get all routes
   */
  getAllRoutes(): Route[] {
    return Array.from(this.routes.values());
  }

  /**
   * Check if route exists
   */
  hasRoute(screenName: ScreenName): boolean {
    return this.routes.has(screenName);
  }

  /**
   * Get navigation state
   */
  getState(): NavigationState {
    return {
      ...this.state,
      history: [...this.state.history],
    };
  }

  /**
   * Subscribe to navigation changes
   */
  subscribe(listener: NavigationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Reset router
   */
  reset(): void {
    this.state = {
      currentRoute: null,
      previousRoute: null,
      params: {},
      history: [],
    };
    this.routes.clear();
  }

  /**
   * Private: Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getState()));
  }
}

export const sdkRouter = SDKRouter.getInstance();
