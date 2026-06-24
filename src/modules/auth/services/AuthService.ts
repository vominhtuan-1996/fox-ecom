/**
 * AuthService
 * Singleton service for authentication
 * (Replaces Flutter's auth repository/cubit pattern)
 */

import { AuthCredentials, AuthToken, AuthUser, AuthSession, AuthExtra } from '../types/auth.types';

type AuthListener = (session: AuthSession | null) => void;

class AuthServiceImpl {
  private static instance: AuthServiceImpl;
  private session: AuthSession | null = null;
  private extra: AuthExtra = {};
  private listeners: Set<AuthListener> = new Set();

  private constructor() {}

  static getInstance(): AuthServiceImpl {
    if (!AuthServiceImpl.instance) {
      AuthServiceImpl.instance = new AuthServiceImpl();
    }
    return AuthServiceImpl.instance;
  }

  async init(config: { token: AuthToken; extra?: AuthExtra }): Promise<void> {
    this.session = {
      token: config.token,
      issuedAt: Date.now(),
    };
    this.extra = config.extra || {};
    this.notifyListeners();
  }

  getSession(): AuthSession | null {
    return this.session;
  }

  getUser(): AuthUser | undefined {
    return this.session?.user;
  }

  getToken(): AuthToken | null {
    return this.session?.token || null;
  }

  getAccessToken(): string | null {
    return this.session?.token.accessToken || null;
  }

  isAuthenticated(): boolean {
    return !!this.session?.token.accessToken;
  }

  setExtra(key: string, value: any): void {
    this.extra[key] = value;
  }

  getExtra(key?: string): any {
    return key ? this.extra[key] : this.extra;
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async logout(): Promise<void> {
    this.session = null;
    this.extra = {};
    this.notifyListeners();
  }

  async refreshToken(): Promise<boolean> {
    if (!this.session?.token.refreshToken) return false;
    // TODO: Implement refresh logic
    return true;
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.session));
  }
}

export const authService = AuthServiceImpl.getInstance();
