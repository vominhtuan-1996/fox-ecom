/**
 * Routing Types
 */

export type ScreenName = string;

export interface RouteParams {
  [key: string]: string | number | boolean | undefined;
}

export interface Route {
  name: ScreenName;
  path: string;
  component: React.ComponentType<any>;
  params?: RouteParams;
}

export interface RouteConfig {
  name: ScreenName;
  path: string;
  params?: RouteParams;
}

export interface NavigationState {
  currentRoute: ScreenName | null;
  previousRoute: ScreenName | null;
  params: RouteParams;
  history: ScreenName[];
}

export interface RouterConfig {
  routes: Route[];
  initialRoute?: ScreenName;
  notFoundComponent?: React.ComponentType<any>;
}
