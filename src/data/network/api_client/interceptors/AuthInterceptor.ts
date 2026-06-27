import { ApiException } from '../ApiException';

export type TokenRefreshHandler = () => Promise<string | null>;

interface RequestContext {
  headers: Record<string, string>;
  extra: Record<string, unknown>;
}

/**
 * AuthInterceptor — inject Bearer token, refresh on 401.
 * Tương đương AuthInterceptor trong Flutter/Dio.
 */
export class AuthInterceptor {
  private _token?: string;
  private _refreshHandler?: TokenRefreshHandler;
  private _isRefreshing = false;
  private _refreshPromise?: Promise<string | null>;

  setToken(token: string): void {
    this._token = token;
  }

  clearToken(): void {
    this._token = undefined;
  }

  getToken(): string | undefined {
    return this._token;
  }

  setRefreshHandler(handler: TokenRefreshHandler): void {
    this._refreshHandler = handler;
  }

  /** Gắn Authorization header vào request context */
  onRequest(ctx: RequestContext): void {
    if (this._token) {
      ctx.headers['Authorization'] = `Bearer ${this._token}`;
    }
  }

  /**
   * Xử lý 401: thử refresh token một lần rồi báo cần retry.
   * Returns new token nếu refresh thành công, null nếu không.
   */
  async onUnauthorized(): Promise<string | null> {
    if (!this._refreshHandler) return null;

    // Deduplicate concurrent refresh calls
    if (this._isRefreshing) {
      return this._refreshPromise ?? null;
    }

    this._isRefreshing = true;
    try {
      this._refreshPromise = this._refreshHandler();
      const newToken = await this._refreshPromise;
      if (newToken) {
        this._token = newToken;
      }
      return newToken;
    } catch {
      return null;
    } finally {
      this._isRefreshing = false;
      this._refreshPromise = undefined;
    }
  }
}
