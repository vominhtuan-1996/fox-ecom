import { BaseResponse } from './base_response';
import {
  HttpException,
  NetworkException,
  TimeoutException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  ServerException,
} from './http_error';
import { CurlLogger } from './interceptors/curl_logger';
import { RetryAuthenticator } from './interceptors/retry_authenticator';

export interface HttpConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface HttpRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

export class HttpClient {
  private config: Required<HttpConfig>;
  private curlLogger: CurlLogger;
  private retryAuth: RetryAuthenticator;
  private authToken?: string;

  constructor(config: HttpConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 10000,
      headers: config.headers || { 'Content-Type': 'application/json' },
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
    };
    this.curlLogger = new CurlLogger();
    this.retryAuth = new RetryAuthenticator();
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private buildUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${this.config.baseURL}${path}`;
  }

  private buildHeaders(): Record<string, string> {
    const headers = { ...this.config.headers };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  private async fetchWithTimeout(
    request: Request,
    timeout: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      return await fetch(request, { signal: controller.signal });
    } finally {
      clearTimeout(id);
    }
  }

  private mapStatusException(status: number, response: any): HttpException {
    switch (status) {
      case 401:
        return new UnauthorizedException(response?.message, response);
      case 403:
        return new ForbiddenException(response?.message, response);
      case 404:
        return new NotFoundException(response?.message, response);
      case 409:
        return new ConflictException(response?.message, response);
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerException(status, response?.message, response);
      default:
        return new HttpException(status, response?.message || 'HTTP Error', response);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw this.mapStatusException(response.status, data);
    }

    return data;
  }

  async request<T = any>(request: HttpRequest): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      try {
        const url = this.buildUrl(request.url);
        const headers = this.buildHeaders();
        const timeout = request.timeout || this.config.timeout;

        const fetchRequest = new Request(url, {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });

        // Log curl
        this.curlLogger.log(fetchRequest, request.body);

        const response = await this.fetchWithTimeout(fetchRequest, timeout);
        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        // Check nếu là lỗi auth, retry nếu có token refresh
        if (error instanceof UnauthorizedException) {
          const refreshed = await this.retryAuth.refreshToken();
          if (refreshed) {
            this.authToken = refreshed;
            continue;
          }
        }

        // Network error hoặc timeout, retry
        if (
          error instanceof NetworkException ||
          error instanceof TimeoutException
        ) {
          if (attempt < this.config.retryAttempts - 1) {
            await new Promise((resolve) =>
              setTimeout(() => resolve(null), this.config.retryDelay * (attempt + 1)),
            );
            continue;
          }
        }

        // Lỗi khác, throw ngay
        throw error;
      }
    }

    throw lastError || new NetworkException('Request failed');
  }

  async get<T = any>(url: string, config?: Partial<HttpRequest>): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      ...config,
    });
  }

  async post<T = any>(
    url: string,
    body?: any,
    config?: Partial<HttpRequest>,
  ): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      body,
      ...config,
    });
  }

  async put<T = any>(
    url: string,
    body?: any,
    config?: Partial<HttpRequest>,
  ): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      body,
      ...config,
    });
  }

  async delete<T = any>(url: string, config?: Partial<HttpRequest>): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...config,
    });
  }

  async patch<T = any>(
    url: string,
    body?: any,
    config?: Partial<HttpRequest>,
  ): Promise<T> {
    return this.request<T>({
      url,
      method: 'PATCH',
      body,
      ...config,
    });
  }
}

// ponytail: singleton instance, per-account if throughput needs multi-connection
export const httpClient = new HttpClient();
