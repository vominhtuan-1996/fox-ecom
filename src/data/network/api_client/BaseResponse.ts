/**
 * BaseResponse — chuẩn hóa định dạng phản hồi từ API.
 * Tương đương BaseResponse<T> trong Flutter.
 *
 * JSON format expected:
 * { "status": 0, "message": "...", "errorData": null, "data": { ... } }
 */
export class BaseResponse<T = unknown> {
  constructor(
    readonly status: number,
    readonly message: string,
    readonly data?: T,
    readonly errorData?: unknown,
  ) {}

  get isSuccess(): boolean {
    return this.status === 0 || (this.status >= 200 && this.status < 300);
  }

  static fromJson<T>(
    json: Record<string, unknown>,
    fromJsonT?: (raw: unknown) => T,
  ): BaseResponse<T> {
    const rawData = json['data'];
    return new BaseResponse<T>(
      (json['status'] as number) ?? 0,
      (json['message'] as string) ?? '',
      rawData != null && fromJsonT ? fromJsonT(rawData) : (rawData as T | undefined),
      json['errorData'],
    );
  }

  static ok<T>(data: T, message = 'Success'): BaseResponse<T> {
    return new BaseResponse<T>(0, message, data);
  }

  static fail<T = undefined>(message: string, status = 1): BaseResponse<T> {
    return new BaseResponse<T>(status, message);
  }
}
