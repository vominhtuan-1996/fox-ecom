import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthCredentials, AuthToken, AuthUser, AuthResponse, AuthSession, AuthExtra, AuthConfig } from '@/common/types/auth.types';
import { envConfig } from '@/common/config/env.config';

/**
 * Authentication Service
 * Handles login, logout, token management
 */
export class AuthService {
  private static instance: AuthService;
  private session: AuthSession | null = null;
  private extra: AuthExtra = {};
  private listeners: Set<(session: AuthSession | null) => void> = new Set();

  private constructor() {
    this.loadSession();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize auth with config
   */
  async init(config: Partial<AuthConfig>): Promise<void> {
    if (config.token) {
      this.setToken(config.token);
    }
    if (config.extra) {
      this.extra = config.extra;
    }
    if (envConfig.isDevelopment()) {
      console.log('🔐 Auth initialized', { token: !!config.token, extra: Object.keys(config.extra || {}) });
    }
  }

  /**
   * Login with credentials
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      if (envConfig.isDevelopment()) {
        console.log('🔑 Logging in with email:', credentials.email);
      }

      // Call API
      const response = await this.callAuthAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.token) {
        const user: AuthUser = response.user || {
          id: 'default-id',
          email: credentials.email,
        };

        this.setSession({
          user,
          token: response.token,
          issuedAt: Date.now(),
          expiresAt: response.token.expiresIn ? Date.now() + response.token.expiresIn * 1000 : undefined,
        });

        if (response.extra) {
          this.extra = response.extra;
        }

        return { success: true, user, token: response.token };
      }

      return { success: false, error: response.error || 'Login failed' };
    } catch (error: any) {
      console.error('❌ Login error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      if (this.session) {
        await this.callAuthAPI('/auth/logout', {
          method: 'POST',
          headers: this.getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      if (!this.session?.token.refreshToken) {
        return false;
      }

      const response = await this.callAuthAPI('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.session.token.refreshToken }),
      });

      if (response.token) {
        this.setToken(response.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return false;
    }
  }

  /**
   * Get current session
   */
  getSession(): AuthSession | null {
    return this.session;
  }

  /**
   * Get current user
   */
  getUser(): AuthUser | null {
    return this.session?.user || null;
  }

  /**
   * Get current token
   */
  getToken(): AuthToken | null {
    return this.session?.token || null;
  }

  /**
   * Get access token string
   */
  getAccessToken(): string | null {
    return this.session?.token.accessToken || null;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return !!this.session && !this.isTokenExpired();
  }

  /**
   * Set extra data
   */
  setExtra(key: string, value: any): void {
    this.extra[key] = value;
    this.saveSession();
  }

  /**
   * Get extra data
   */
  getExtra(key?: string): AuthExtra | any {
    if (key) {
      return this.extra[key];
    }
    return this.extra;
  }

  /**
   * Subscribe to auth changes
   */
  subscribe(listener: (session: AuthSession | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Private methods
   */
  private setSession(session: AuthSession): void {
    this.session = session;
    this.saveSession();
    this.notifyListeners();
  }

  private setToken(token: AuthToken): void {
    if (this.session) {
      this.session.token = token;
      this.session.issuedAt = Date.now();
      if (token.expiresIn) {
        this.session.expiresAt = Date.now() + token.expiresIn * 1000;
      }
      this.saveSession();
    }
  }

  private clearSession(): void {
    this.session = null;
    this.extra = {};
    this.removeSession();
    this.notifyListeners();
  }

  private isTokenExpired(): boolean {
    if (!this.session?.expiresAt) {
      return false;
    }
    return Date.now() > this.session.expiresAt;
  }

  private saveSession(): void {
    if (this.session) {
      AsyncStorage.setItem('fox_ecom_auth_session', JSON.stringify(this.session)).catch(() => {});
      AsyncStorage.setItem('fox_ecom_auth_extra', JSON.stringify(this.extra)).catch(() => {});
    }
  }

  async loadSessionAsync(): Promise<void> {
    try {
      const [sessionStr, extraStr] = await AsyncStorage.multiGet([
        'fox_ecom_auth_session',
        'fox_ecom_auth_extra',
      ]);
      if (sessionStr[1]) this.session = JSON.parse(sessionStr[1]);
      if (extraStr[1]) this.extra = JSON.parse(extraStr[1]);
    } catch (error) {
      console.error('Failed to load auth session:', error);
    }
  }

  private loadSession(): void {
    this.loadSessionAsync().catch(() => {});
  }

  private removeSession(): void {
    AsyncStorage.multiRemove(['fox_ecom_auth_session', 'fox_ecom_auth_extra']).catch(() => {});
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.session));
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.session?.token) {
      headers['Authorization'] = `${this.session.token.tokenType || 'Bearer'} ${this.session.token.accessToken}`;
    }

    return headers;
  }

  private async callAuthAPI(
    endpoint: string,
    options: RequestInit,
  ): Promise<any> {
    const url = `${envConfig.get('apiBaseUrl')}${endpoint}`;
    const timeout = Number(envConfig.get('apiTimeout'));

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...(options.headers || {}),
          'X-App-Version': String(envConfig.get('appVersion')),
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } finally {
      clearTimeout(id);
    }
  }
}

export const authService = AuthService.getInstance();
