import { ApiException } from '../ApiException';

/**
 * ErrorInterceptor — map mọi lỗi HTTP/network về ApiException.
 * Tương đương ErrorInterceptor trong Flutter/Dio.
 */
export class ErrorInterceptor {
  async handle(response: Response): Promise<never> {
    let body: unknown;
    try {
      const ct = response.headers.get('content-type') ?? '';
      body = ct.includes('application/json') ? await response.json() : await response.text();
    } catch {
      body = undefined;
    }
    throw ApiException.fromResponse(response.status, body);
  }

  handleNetworkError(err: unknown): never {
    if (err instanceof ApiException) throw err;

    const message = (err as Error)?.message ?? '';

    if (message.includes('aborted') || message.includes('abort')) {
      throw ApiException.cancelled();
    }
    if (message.includes('timeout') || message.includes('Timeout')) {
      throw ApiException.timeout(0);
    }
    if (
      message.includes('Network request failed') ||
      message.includes('Failed to fetch') ||
      message.includes('ENOTFOUND') ||
      message.includes('ECONNREFUSED')
    ) {
      throw ApiException.network();
    }

    throw new ApiException(message || 'Unknown network error');
  }
}
