/**
 * useNavigation Hook
 * React hook for navigation
 */

import { useEffect, useState } from 'react';
import { sdkRouter } from '../router';
import { ScreenName, RouteParams, NavigationState } from '../types/navigation.types';

export function useNavigation() {
  const [state, setState] = useState<NavigationState>(sdkRouter.getState());

  useEffect(() => {
    const unsubscribe = sdkRouter.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return {
    currentRoute: state.currentRoute,
    previousRoute: state.previousRoute,
    params: state.params,
    history: state.history,
    navigate: (screenName: ScreenName, params?: RouteParams) =>
      sdkRouter.navigate(screenName, params),
    goBack: () => sdkRouter.goBack(),
    getParams: (key?: string) => {
      const params = sdkRouter.getParams();
      return key ? params[key] : params;
    },
    isRoute: (screenName: ScreenName) => state.currentRoute === screenName,
    canGoBack: () => state.history.length > 1,
  };
}
