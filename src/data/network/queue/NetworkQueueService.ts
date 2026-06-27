import { RequestOptions } from '../api_client/ApiClient';
import { ApiException } from '../api_client/ApiException';
import { NetworkQueueTask, QueueTaskStatus } from './NetworkQueueTask';

export interface QueueConfig {
  /** Số request chạy song song tối đa (default 2) */
  concurrency?: number;
  /** Exponential backoff khi retry (default true) */
  exponentialBackoff?: boolean;
  /** Base delay giữa các lần retry (ms, default 2000) */
  retryDelay?: number;
}

/**
 * NetworkQueueService — xếp hàng HTTP request với giới hạn concurrency.
 * Tương đương NetworkQueueService trong Flutter.
 *
 * Dùng khi cần:
 * - Giới hạn số request chạy đồng thời (rate limiting)
 * - Đảm bảo thứ tự thực thi
 * - Retry toàn bộ queue sau khi mất mạng
 */
export class NetworkQueueService {
  private static _instance: NetworkQueueService;

  private _queue: NetworkQueueTask[] = [];
  private _running = 0;
  private _concurrency: number;
  private _exponentialBackoff: boolean;
  private _retryDelay: number;
  private _isPaused = false;
  private _initialized = false;
  private _idCounter = 0;

  private constructor() {
    this._concurrency = 2;
    this._exponentialBackoff = true;
    this._retryDelay = 2000;
  }

  static get instance(): NetworkQueueService {
    if (!NetworkQueueService._instance) {
      NetworkQueueService._instance = new NetworkQueueService();
    }
    return NetworkQueueService._instance;
  }

  init(config: QueueConfig = {}): void {
    if (this._initialized) return;
    this._concurrency = config.concurrency ?? 2;
    this._exponentialBackoff = config.exponentialBackoff ?? true;
    this._retryDelay = config.retryDelay ?? 2000;
    this._initialized = true;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  get pendingCount(): number {
    return this._queue.filter(t => t.status === 'pending').length;
  }

  get runningCount(): number {
    return this._running;
  }

  // ── Public API ────────────────────────────────────────────────────────────────

  request<T = unknown>(
    path: string,
    options: RequestOptions & { maxRetries?: number } = {},
  ): Promise<T> {
    if (!this._initialized) this.init();

    const id = String(++this._idCounter);
    const task = new NetworkQueueTask<T>(id, path, options);
    this._queue.push(task as NetworkQueueTask);
    this._tick();
    return task.promise;
  }

  get<T = unknown>(path: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  put<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  delete<T = unknown>(path: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  cancel(id: string): void {
    const task = this._queue.find(t => t.id === id);
    if (task && task.status === 'pending') {
      task.cancel();
      this._queue = this._queue.filter(t => t.id !== id);
    }
  }

  pause(): void {
    this._isPaused = true;
  }

  resume(): void {
    this._isPaused = false;
    this._tick();
  }

  clear(): void {
    this._queue.forEach(t => {
      if (t.status === 'pending' || t.status === 'executing') {
        t.cancel();
      }
    });
    this._queue = [];
    this._running = 0;
  }

  updateConfig(config: QueueConfig): void {
    if (config.concurrency !== undefined) this._concurrency = config.concurrency;
    if (config.retryDelay !== undefined) this._retryDelay = config.retryDelay;
    if (config.exponentialBackoff !== undefined) this._exponentialBackoff = config.exponentialBackoff;
    this._tick();
  }

  // ── Internal ─────────────────────────────────────────────────────────────────

  private _tick(): void {
    if (this._isPaused) return;

    while (this._running < this._concurrency) {
      const next = this._queue.find(t => t.status === 'pending');
      if (!next) break;
      this._execute(next);
    }
  }

  private async _execute(task: NetworkQueueTask): Promise<void> {
    task.status = 'executing';
    this._running++;

    try {
      await task.execute();
    } catch (err) {
      const canRetry = task.retries < task.maxRetries && !(err instanceof ApiException && err.isUnauthorized);
      if (canRetry) {
        task.retries++;
        task.status = 'pending'; // re-queue

        const delay = this._exponentialBackoff
          ? this._retryDelay * Math.pow(2, task.retries - 1)
          : this._retryDelay;

        setTimeout(() => this._tick(), delay);
      }
      // nếu không retry nữa, task.execute() đã reject promise rồi
    } finally {
      this._running--;
      // Dọn task đã xong khỏi queue
      const finalStatus = task.status as QueueTaskStatus;
      if (finalStatus === 'completed' || finalStatus === 'failed') {
        this._queue = this._queue.filter(t => t.id !== task.id);
      }
      this._tick(); // chạy task tiếp theo
    }
  }
}
