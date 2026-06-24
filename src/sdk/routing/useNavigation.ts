/**
 * useNavigation Hook
 * React hook for SDK routing
 */

import { useEffect, useState } from 'react';
import { sdkRouter } from './router';
import { ScreenName, RouteParams, NavigationState } from './types';

export function useNavigation() {
  const [state, setState] = useState<NavigationState>(sdkRouter.getState());

  useEffect(() => {
    const unsubscribe = sdkRouter.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  const navigate = (screenName: ScreenName, params?: RouteParams): boolean => {
    return sdkRouter.navigate(screenName, params);
  };

  const goBack = (): boolean => {
    return sdkRouter.goBack();
  };

  const getParams = (key?: string): any => {
    const params = sdkRouter.getParams();
    if (key) return params[key];
    return params;
  };

  return {
    // State
    currentRoute: state.currentRoute,
    previousRoute: state.previousRoute,
    params: state.params,
    history: state.history,

    // Methods
    navigate,
    goBack,
    getParams,

    // Utils
    isRoute: (screenName: ScreenName) => state.currentRoute === screenName,
    canGoBack: () => state.history.length > 1,
  };
}

export type UseNavigationReturn = ReturnType<typeof useNavigation>;
