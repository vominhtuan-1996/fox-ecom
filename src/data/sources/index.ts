// Deprecated: dùng src/data/network/ thay thế
// File này chỉ giữ lại để tránh break import cũ
export { HttpClient, httpClient } from './http_client';
export type { HttpConfig, HttpRequest } from './http_client';
export { ApiResponse } from './base_response';
export type { BaseResponse } from './base_response';
export {
  HttpException,
  NetworkException,
  TimeoutException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  ServerException,
} from './http_error';
export * from './interceptors';
