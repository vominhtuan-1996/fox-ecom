/**
 * ApiException — unified error class cho toàn bộ network layer.
 * Tương đương ApiException trong Flutter/Dio.
 */
export class ApiException extends Error {
  readonly statusCode?: number;
  readonly data?: unknown;

  constructor(message: string, options?: { statusCode?: number; data?: unknown }) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = options?.statusCode;
    this.data = options?.data;
  }

  get isUnauthorized() { return this.statusCode === 401; }
  get isForbidden()    { return this.statusCode === 403; }
  get isNotFound()     { return this.statusCode === 404; }
  get isServerError()  { return (this.statusCode ?? 0) >= 500; }
  get isNetworkError() { return this.statusCode === undefined; }
  get isTimeout()      { return this.name === 'TimeoutError' || this.message.includes('timeout'); }

  toString() {
    return `ApiException(${this.statusCode ?? 'network'}: ${this.message})`;
  }

  static fromResponse(status: number, body: unknown): ApiException {
    const message =
      (body as any)?.message ||
      (body as any)?.error ||
      STATUS_MESSAGES[status] ||
      `HTTP ${status}`;
    return new ApiException(message, { statusCode: status, data: body });
  }

  static network(message = 'No Internet Connection'): ApiException {
    return new ApiException(message);
  }

  static timeout(ms: number): ApiException {
    const e = new ApiException(`Request timed out after ${ms}ms`, { statusCode: undefined });
    e.name = 'TimeoutError';
    return e;
  }

  static cancelled(): ApiException {
    const e = new ApiException('Request was cancelled');
    e.name = 'CancelledError';
    return e;
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};
