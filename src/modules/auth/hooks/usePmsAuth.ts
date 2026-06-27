import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pmsAuthRepository } from '../repositories/PmsAuthRepository';
import { PmsUserModel } from '../types/pms.types';
import { ApiClient } from '../../../data/network/api_client/ApiClient';
import { ApiException } from '../../../data/network/api_client/ApiException';
import { SdkStrings } from '../../../common/language';

const STORAGE_KEY = 'pms_auth_user';

export interface PmsAuthState {
  user: PmsUserModel | null;
  token: string | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
}

export function usePmsAuth() {
  const [state, setState] = useState<PmsAuthState>({
    user: null,
    token: null,
    permissions: [],
    loading: false,
    error: null,
  });

  const _saveSession = async (user: PmsUserModel, permissions: string[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, permissions }));
  };

  const _clearSession = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const loadSession = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { user, permissions } = JSON.parse(raw);
        setState(s => ({ ...s, user, token: user.token ?? null, permissions }));
      }
    } catch (_) {}
  }, []);

  const login = useCallback(async (userName: string, password: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const user = await pmsAuthRepository.loginWithCredentials({ userName, password });

      if (!user?.token) throw new ApiException(SdkStrings.auth.errorLoginFailed);

      const permissions = await pmsAuthRepository.getPermissions(user.token).catch(() => []);

      ApiClient.instance.setAuthToken(user.token);
      await _saveSession(user, permissions);
      setState({ user, token: user.token, permissions, loading: false, error: null });
      return { success: true, user };
    } catch (e) {
      const error = _extractMessage(e, SdkStrings.auth.errorLoginFailed);
      setState(s => ({ ...s, loading: false, error }));
      return { success: false, error };
    }
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const user = await pmsAuthRepository.loginWithToken({ code: token });

      if (!user?.token) throw new ApiException(SdkStrings.auth.errorInvalidCredentials);

      const permissions = await pmsAuthRepository.getPermissions(user.token).catch(() => []);

      ApiClient.instance.setAuthToken(user.token);
      await _saveSession(user, permissions);
      setState({ user, token: user.token, permissions, loading: false, error: null });
      return { success: true, user };
    } catch (e) {
      const error = _extractMessage(e, SdkStrings.auth.errorLoginFailed);
      setState(s => ({ ...s, loading: false, error }));
      return { success: false, error };
    }
  }, []);

  const logout = useCallback(async () => {
    ApiClient.instance.clearAuthToken();
    await _clearSession();
    setState({ user: null, token: null, permissions: [], loading: false, error: null });
  }, []);

  return {
    ...state,
    isAuthenticated: !!state.token,
    login,
    loginWithToken,
    logout,
    loadSession,
  };
}

function _extractMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiException) return err.message;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}
