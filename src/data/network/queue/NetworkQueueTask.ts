import { ApiClient, RequestOptions } from '../api_client/ApiClient';
import { ApiException } from '../api_client/ApiException';

export type QueueTaskStatus = 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled';

/**
 * NetworkQueueTask — một HTTP request được đóng gói thành task để xếp hàng.
 * Tương đương NetworkQueueTask trong Flutter.
 */
export class NetworkQueueTask<T = unknown> {
  readonly id: string;
  readonly name: string;

  status: QueueTaskStatus = 'pending';
  retries = 0;
  error?: string;
  readonly createdAt = Date.now();

  private readonly _resolve: (value: T) => void;
  private readonly _reject: (reason: unknown) => void;
  readonly promise: Promise<T>;

  constructor(
    id: string,
    readonly path: string,
    readonly options: RequestOptions & { maxRetries?: number } = {},
  ) {
    this.id = id;
    this.name = `${options.method ?? 'GET'} ${path}`;

    // Tương đương Completer<T> trong Flutter
    let resolve!: (value: T) => void;
    let reject!: (reason: unknown) => void;
    this.promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this._resolve = resolve;
    this._reject = reject;
  }

  get maxRetries(): number {
    return this.options.maxRetries ?? 3;
  }

  async execute(): Promise<void> {
    try {
      const result = await ApiClient.instance.request<T>(this.path, this.options);
      this._resolve(result);
      this.status = 'completed';
    } catch (err) {
      if (this.retries >= this.maxRetries) {
        this._reject(err);
        this.status = 'failed';
        this.error = err instanceof ApiException ? err.message : String(err);
      }
      throw err; // NetworkQueueService bắt để retry
    }
  }

  cancel(): void {
    this.status = 'cancelled';
    this._reject(ApiException.cancelled());
  }
}
