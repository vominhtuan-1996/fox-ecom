/**
 * Token Validator Service
 * Validates app tokens before granting SDK access
 */

export interface TokenValidationResult {
  valid: boolean;
  appId?: string;
  message: string;
  error?: string;
}

export interface StoredToken {
  appId: string;
  token: string;
  secret: string;
  active: boolean;
  createdAt: number;
  expiresAt?: number;
  permissions?: string[];
}

/**
 * Token Storage - trong production dùng database
 */
class TokenStore {
  private tokens: Map<string, StoredToken> = new Map();

  // Ví dụ test tokens
  private seedTokens() {
    this.addToken({
      appId: 'app-a',
      token: 'token_app_a_secret_123',
      secret: 'secret_a_xyz789',
      active: true,
      createdAt: Date.now(),
      permissions: ['read', 'write'],
    });

    this.addToken({
      appId: 'app-b',
      token: 'token_app_b_secret_456',
      secret: 'secret_b_abc123',
      active: true,
      createdAt: Date.now(),
      permissions: ['read'],
    });
  }

  constructor() {
    this.seedTokens();
  }

  addToken(token: StoredToken): void {
    this.tokens.set(token.token, token);
  }

  getToken(token: string): StoredToken | null {
    return this.tokens.get(token) || null;
  }

  hasToken(token: string): boolean {
    return this.tokens.has(token);
  }

  getAllTokens(): StoredToken[] {
    return Array.from(this.tokens.values());
  }

  removeToken(token: string): void {
    this.tokens.delete(token);
  }
}

export class TokenValidator {
  private static instance: TokenValidator;
  private store: TokenStore;

  private constructor() {
    this.store = new TokenStore();
  }

  static getInstance(): TokenValidator {
    if (!TokenValidator.instance) {
      TokenValidator.instance = new TokenValidator();
    }
    return TokenValidator.instance;
  }

  /**
   * Validate token từ client app
   */
  validate(token: string): TokenValidationResult {
    try {
      // Check if token exists
      if (!token || typeof token !== 'string') {
        return {
          valid: false,
          message: 'Invalid token format',
          error: 'TOKEN_INVALID_FORMAT',
        };
      }

      // Find token in store
      const storedToken = this.store.getToken(token);
      if (!storedToken) {
        return {
          valid: false,
          message: 'Token not found',
          error: 'TOKEN_NOT_FOUND',
        };
      }

      // Check if token is active
      if (!storedToken.active) {
        return {
          valid: false,
          message: 'Token is inactive',
          error: 'TOKEN_INACTIVE',
        };
      }

      // Check expiration
      if (storedToken.expiresAt && Date.now() > storedToken.expiresAt) {
        return {
          valid: false,
          message: 'Token expired',
          error: 'TOKEN_EXPIRED',
        };
      }

      return {
        valid: true,
        appId: storedToken.appId,
        message: 'Token is valid',
      };
    } catch (error: any) {
      return {
        valid: false,
        message: `Validation error: ${error.message}`,
        error: 'VALIDATION_ERROR',
      };
    }
  }

  /**
   * Validate with permission check
   */
  validateWithPermission(token: string, requiredPermission: string): TokenValidationResult {
    const result = this.validate(token);
    if (!result.valid) {
      return result;
    }

    const storedToken = this.store.getToken(token);
    if (!storedToken?.permissions?.includes(requiredPermission)) {
      return {
        valid: false,
        message: `Permission denied: ${requiredPermission}`,
        error: 'PERMISSION_DENIED',
      };
    }

    return result;
  }

  /**
   * Get app info từ token
   */
  getAppInfo(token: string): StoredToken | null {
    const result = this.validate(token);
    if (!result.valid) {
      return null;
    }
    return this.store.getToken(token);
  }

  /**
   * Register new token (admin only)
   */
  registerToken(appId: string, token: string, secret: string, permissions?: string[]): void {
    this.store.addToken({
      appId,
      token,
      secret,
      active: true,
      createdAt: Date.now(),
      permissions: permissions || [],
    });
  }

  /**
   * Revoke token
   */
  revokeToken(token: string): boolean {
    const stored = this.store.getToken(token);
    if (stored) {
      stored.active = false;
      return true;
    }
    return false;
  }

  /**
   * List all active tokens (admin)
   */
  listActiveTokens(): StoredToken[] {
    return this.store.getAllTokens().filter((t) => t.active);
  }
}

export const tokenValidator = TokenValidator.getInstance();
