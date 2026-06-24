/**
 * Navigation Module
 * Routing and navigation (similar to Flutter routes/)
 */

export { sdkRouter } from './router';
export { useNavigation } from './hooks/useNavigation';
export { handleDeepLink, createDeepLink, parseDeepLink } from './deep-linking';
export type { Route, ScreenName, RouteParams, NavigationState } from './types/navigation.types';
