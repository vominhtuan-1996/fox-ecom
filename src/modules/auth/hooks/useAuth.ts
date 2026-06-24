import { useEffect, useState } from 'react';
import { authService } from '@/domain/services/auth.service';
import { AuthSession, AuthUser, AuthCredentials, AuthResponse, AuthExtra } from '@/common/types/auth.types';

/**
 * useAuth Hook
 * Provides authentication functionality
 */
export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(authService.getSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = authService.subscribe((newSession) => {
      setSession(newSession);
    });

    return unsubscribe;
  }, []);

  const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      if (!response.success) {
        setError(response.error || 'Login failed');
      }
      return response;
    } catch (err: any) {
      const message = err.message || 'Login error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err: any) {
      setError(err.message || 'Logout error');
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      return await authService.refreshToken();
    } catch (err: any) {
      setError(err.message || 'Token refresh error');
      return false;
    }
  };

  const setExtra = (key: string, value: any): void => {
    authService.setExtra(key, value);
  };

  const getExtra = (key?: string): AuthExtra | any => {
    return authService.getExtra(key);
  };

  return {
    // State
    session,
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: authService.isAuthenticated(),
    loading,
    error,

    // Methods
    login,
    logout,
    refreshToken,
    setExtra,
    getExtra,
    getAccessToken: () => authService.getAccessToken(),
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
