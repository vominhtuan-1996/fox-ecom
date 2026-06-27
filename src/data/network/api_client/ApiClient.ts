import { ApiException } from './ApiException';
import { ApiCacheStore } from './ApiCacheStore';
import { AuthInterceptor, TokenRefreshHandler } from './interceptors/AuthInterceptor';
import { ErrorInterceptor } from './interceptors/ErrorInterceptor';
import { RetryInterceptor, RetryConfig } from './interceptors/RetryInterceptor';
import { CurlLogger } from './interceptors/CurlLogger';

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;          // ms, default 10000
  headers?: Record<string, string>;
  tokenRefreshHandler?: TokenRefreshHandler;
  retry?: RetryConfig;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  /** Override baseUrl cho request này */
  baseUrl?: string;
  timeout?: number;
  /** Cache response — dùng ApiCacheStore */
  useCache?: boolean;
  /** TTL cho cache entry (ms). Mặc định: không hết hạn */
  cacheTtl?: number;
  signal?: AbortSignal;
}

/**
 * ApiClient — Singleton HTTP client cho toàn bộ SDK.
 * Tương đương ApiClient trong Flutter/Dio.
 *
 * Features:
 * - Singleton: `ApiClient.instance`
 * - `init()` gọi một lần khi khởi động app
 * - Bearer token + auto-refresh on 401
 * - Retry tự động (5xx, network error, timeout)
 * - In-memory cache với TTL
 * - Curl logging (dev only)
 * - Per-request baseUrl override
 */
export class ApiClient {
  private static _instance: ApiClient;

  private _config!: Required<Omit<ApiClientConfig, 'tokenRefreshHandler' | 'retry'>>;
  private _auth: AuthInterceptor;
  private _error: ErrorInterceptor;
  private _retry: RetryInterceptor;
  private _logger: CurlLogger;
  private _initialized = false;

  private constructor() {
    this._auth = new AuthInterceptor();
    this._error = new ErrorInterceptor();
    this._retry = new RetryInterceptor();
    this._logger = new CurlLogger();
  }

  static get instance(): ApiClient {
    if (!ApiClient._instance) {
      ApiClient._instance = new ApiClient();
    }
    return ApiClient._instance;
  }

  /** Khởi tạo một lần khi app start — gọi trong initializeApp() */
  init(config: ApiClientConfig): void {
    this._config = {
      baseUrl: config.baseUrl,
      timeout: config.timeout ?? 10_000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };

    if (config.tokenRefreshHandler) {
      this._auth.setRefreshHandler(config.tokenRefreshHandler);
    }
    if (config.retry) {
      this._retry = new RetryInterceptor(config.retry);
    }

    this._initialized = true;
  }

  setAuthToken(token: string): void {
    this._auth.setToken(token);
  }

  clearAuthToken(): void {
    this._auth.clearToken();
  }

  get authToken(): string | undefined {
    return this._auth.getToken();
  }

  // ── Core request ─────────────────────────────────────────────────────────────

  async request<T = unknown>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    this._assertInitialized();

    const {
      method = 'GET',
      body,
      params,
      headers: extraHeaders,
      baseUrl,
      timeout,
      useCache = false,
      cacheTtl,
      signal,
    } = options;

    // Cache check
    const cacheKey = ApiCacheStore.instance.generateKey(method, path, params, body);
    if (useCache) {
      const cached = ApiCacheStore.instance.get(cacheKey);
      if (cached !== undefined) {
        return cached as T;
      }
    }

    const url = this._buildUrl(path, params, baseUrl);
    const headers = this._buildHeaders(extraHeaders);
    const timeoutMs = timeout ?? this._config.timeout;

    let attempt = 0;
    while (true) {
      try {
        const controller = new AbortController();
        const timerId = setTimeout(() => controller.abort(), timeoutMs);
        const combinedSignal = signal ?? controller.signal;

        this._logger.log(method, url, headers, body);

        const response = await fetch(url, {
          method,
          headers,
          body: body != null ? JSON.stringify(body) : undefined,
          signal: combinedSignal,
        });

        clearTimeout(timerId);
        this._logger.logResponse(response.status, url);

        // 401 → try refresh once
        if (response.status === 401 && attempt === 0) {
          const newToken = await this._auth.onUnauthorized();
          if (newToken) {
            attempt++;
            headers['Authorization'] = `Bearer ${newToken}`;
            continue; // retry with new token
          }
        }

        if (!response.ok) {
          await this._error.handle(response);
        }

        const data = await this._parseBody<T>(response);

        if (useCache) {
          ApiCacheStore.instance.set(cacheKey, data, cacheTtl);
        }

        return data;
      } catch (err) {
        const apiErr = err instanceof ApiException ? err : (() => {
          this._error.handleNetworkError(err);
        })();

        // TypeScript needs this cast — handleNetworkError always throws
        const ex = apiErr as ApiException;

        if (this._retry.shouldRetry(ex, attempt)) {
          await this._retry.waitBeforeRetry(attempt);
          attempt++;
          continue;
        }

        throw ex;
      }
    }
  }

  // ── Convenience methods ───────────────────────────────────────────────────────

  get<T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  put<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  delete<T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  patch<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  /** Upload file(s) dùng FormData */
  async upload<T = unknown>(
    path: string,
    formData: FormData,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T> {
    this._assertInitialized();
    const headers = this._buildHeaders(options?.headers);
    // FormData tự xử lý Content-Type boundary — phải xóa bỏ Content-Type mặc định
    delete headers['Content-Type'];

    const url = this._buildUrl(path, options?.params, options?.baseUrl);
    this._logger.log('POST', url, headers);

    const response = await fetch(url, { method: 'POST', headers, body: formData });
    this._logger.logResponse(response.status, url);

    if (!response.ok) await this._error.handle(response);
    return this._parseBody<T>(response);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private _buildUrl(
    path: string,
    params?: Record<string, unknown>,
    baseUrl?: string,
  ): string {
    const base = (baseUrl ?? this._config.baseUrl).replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = path.startsWith('http') ? path : `${base}${normalizedPath}`;

    if (params && Object.keys(params).length > 0) {
      const qs = Object.entries(params)
        .filter(([, v]) => v != null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');
      return `${url}?${qs}`;
    }
    return url;
  }

  private _buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = { ...this._config.headers, ...extra };
    this._auth.onRequest({ headers, extra: {} });
    return headers;
  }

  private async _parseBody<T>(response: Response): Promise<T> {
    const ct = response.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    return response.text() as unknown as T;
  }

  private _assertInitialized(): void {
    if (!this._initialized) {
      throw new Error('ApiClient not initialized. Call ApiClient.instance.init() first.');
    }
  }
}
