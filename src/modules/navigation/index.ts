/**
 * Navigation Module
 * Routing and navigation (replaces Flutter's routes/)
 */

export { sdkRouter } from './router';
export { useNavigation } from './hooks/useNavigation';
export { handleDeepLink, parseDeepLink, createDeepLink } from './deep-linking';
export type { Route, ScreenName, RouteParams, NavigationState } from './types/navigation.types';
