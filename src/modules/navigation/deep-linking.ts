/**
 * Deep Linking
 */

import { sdkRouter } from './router';
import { ScreenName, RouteParams } from './types/navigation.types';

export function parseDeepLink(url: string) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const segments = pathname.split('/').filter((s) => s);
    const screenName = segments[segments.length - 1] || '';

    if (!screenName) return null;

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

export function handleDeepLink(url: string): boolean {
  const parsed = parseDeepLink(url);
  if (!parsed) return false;
  return sdkRouter.navigate(parsed.screen, parsed.params);
}

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
