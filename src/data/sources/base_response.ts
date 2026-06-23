/**
 * Base API response wrapper
 */
export interface BaseResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  timestamp: string;
}

export class ApiResponse<T> implements BaseResponse<T> {
  constructor(
    readonly success: boolean,
    readonly code: number,
    readonly message: string,
    readonly data?: T,
    readonly timestamp: string = new Date().toISOString(),
  ) {}

  static ok<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, 200, message, data);
  }

  static error<T = undefined>(
    code: number,
    message: string,
    data?: T,
  ): ApiResponse<T> {
    return new ApiResponse(false, code, message, data);
  }

  isSuccess(): boolean {
    return this.success && this.code >= 200 && this.code < 300;
  }
}
