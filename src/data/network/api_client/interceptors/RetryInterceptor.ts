import { ApiException } from '../ApiException';

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number; // ms, base delay — multiplied by attempt (exponential)
  exponentialBackoff?: boolean;
}

/**
 * RetryInterceptor — retry tự động khi gặp lỗi 5xx hoặc network error.
 * Tương đương RetryInterceptor trong Flutter/Dio.
 */
export class RetryInterceptor {
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly exponentialBackoff: boolean;

  constructor(config: RetryConfig = {}) {
    this.maxRetries = config.maxRetries ?? 2;
    this.retryDelay = config.retryDelay ?? 1000;
    this.exponentialBackoff = config.exponentialBackoff ?? true;
  }

  shouldRetry(err: ApiException, attempt: number): boolean {
    if (attempt >= this.maxRetries) return false;
    // Retry: network error, timeout, 5xx
    return (
      err.isNetworkError ||
      err.isTimeout ||
      err.isServerError
    );
  }

  async waitBeforeRetry(attempt: number): Promise<void> {
    const delay = this.exponentialBackoff
      ? this.retryDelay * Math.pow(2, attempt)
      : this.retryDelay;
    await new Promise<void>(resolve => setTimeout(resolve, delay));
  }
}
