/**
 * Router Service
 * Manages routing and navigation state
 */

import { Route, ScreenName, RouteParams, NavigationState } from './types/navigation.types';

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

  registerRoutes(routes: Route[]): void {
    routes.forEach((route) => this.routes.set(route.name, route));
    console.log('📍 Routes registered:', routes.map((r) => r.name));
  }

  navigate(screenName: ScreenName, params?: RouteParams): boolean {
    const route = this.routes.get(screenName);
    if (!route) {
      console.error('❌ Route not found:', screenName);
      return false;
    }

    this.state.previousRoute = this.state.currentRoute;
    this.state.currentRoute = screenName;
    this.state.params = params || {};

    if (!this.state.history.includes(screenName)) {
      this.state.history.push(screenName);
    }

    this.notifyListeners();
    console.log('📍 Navigated to:', screenName, { params });
    return true;
  }

  goBack(): boolean {
    if (this.state.history.length <= 1) return false;
    this.state.history.pop();
    const previousRoute = this.state.history[this.state.history.length - 1];
    if (previousRoute) {
      this.state.previousRoute = this.state.currentRoute;
      this.state.currentRoute = previousRoute;
      this.state.params = {};
      this.notifyListeners();
      return true;
    }
    return false;
  }

  getCurrentRoute(): ScreenName | null {
    return this.state.currentRoute;
  }

  getParams(): RouteParams {
    return { ...this.state.params };
  }

  getRouteComponent(screenName?: ScreenName): React.ComponentType<any> | null {
    const name = screenName || this.state.currentRoute;
    if (!name) return null;
    return this.routes.get(name)?.component || null;
  }

  getState(): NavigationState {
    return { ...this.state, history: [...this.state.history] };
  }

  subscribe(listener: NavigationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  reset(): void {
    this.state = {
      currentRoute: null,
      previousRoute: null,
      params: {},
      history: [],
    };
    this.routes.clear();
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getState()));
  }
}

export const sdkRouter = SDKRouter.getInstance();
