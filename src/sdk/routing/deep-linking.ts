/**
 * Deep Linking Support
 * Handle deep links to navigate to specific screens
 */

import { sdkRouter } from './router';
import { ScreenName, RouteParams } from './types';

/**
 * Parse URL to extract screen and params
 */
export function parseDeepLink(url: string): { screen: ScreenName; params: RouteParams } | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Extract screen name from path
    // Format: /screen-name or /app/screen-name
    const segments = pathname.split('/').filter((s) => s);
    const screenName = segments[segments.length - 1] || '';

    if (!screenName) {
      return null;
    }

    // Extract params from query string
    const params: RouteParams = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return { screen: screenName, params };
  } catch (error) {
    console.error('❌ Invalid deep link:', error);
    return null;
  }
}

/**
 * Handle deep link and navigate
 */
export function handleDeepLink(url: string): boolean {
  const parsed = parseDeepLink(url);
  if (!parsed) {
    return false;
  }

  const { screen, params } = parsed;
  return sdkRouter.navigate(screen, params);
}

/**
 * Create deep link URL
 */
export function createDeepLink(
  baseUrl: string,
  screenName: ScreenName,
  params?: RouteParams
): string {
  const url = new URL(`/${screenName}`, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Listen to deep links (browser)
 */
export function listenToDeepLinks(onDeepLink?: (screen: ScreenName, params: RouteParams) => void): () => void {
  // Handle browser back button
  const handlePopState = () => {
    const current = sdkRouter.getCurrentRoute();
    if (!current) {
      sdkRouter.goBack();
    }
  };

  // Handle URL change
  const handleHashChange = () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      handleDeepLink(`/${hash}`);
    }
  };

  window.addEventListener('popstate', handlePopState);
  window.addEventListener('hashchange', handleHashChange);

  return () => {
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('hashchange', handleHashChange);
  };
}

/**
 * Navigate via URL
 */
export function navigateToUrl(url: string): boolean {
  const success = handleDeepLink(url);
  if (success) {
    window.history.pushState(null, '', url);
  }
  return success;
}
