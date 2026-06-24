/**
 * useAuth Hook
 * React hook for authentication state and methods
 * (Replaces Flutter's Cubit pattern)
 */

import { useEffect, useState } from 'react';
import { authService } from '../services/AuthService';
import { AuthSession, AuthUser, AuthToken } from '../types/auth.types';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(authService.getSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe((newSession) => {
      setSession(newSession);
    });
    return unsubscribe;
  }, []);

  return {
    session,
    user: session?.user,
    token: session?.token,
    isAuthenticated: authService.isAuthenticated(),
    loading,
    error,
    getAccessToken: () => authService.getAccessToken(),
    setExtra: (key: string, value: any) => authService.setExtra(key, value),
    getExtra: (key?: string) => authService.getExtra(key),
    logout: async () => {
      setLoading(true);
      try {
        await authService.logout();
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
