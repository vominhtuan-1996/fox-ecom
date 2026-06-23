/**
 * HTTP error classes
 */
export class HttpException extends Error {
  constructor(
    readonly statusCode: number,
    readonly message: string,
    readonly response?: any,
  ) {
    super(message);
    this.name = 'HttpException';
  }
}

export class NetworkException extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = 'NetworkException';
  }
}

export class TimeoutException extends Error {
  constructor(readonly timeout: number) {
    super(`Request timeout after ${timeout}ms`);
    this.name = 'TimeoutException';
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized', response?: any) {
    super(401, message, response);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden', response?: any) {
    super(403, message, response);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found', response?: any) {
    super(404, message, response);
    this.name = 'NotFoundException';
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict', response?: any) {
    super(409, message, response);
    this.name = 'ConflictException';
  }
}

export class ServerException extends HttpException {
  constructor(
    statusCode: number = 500,
    message: string = 'Internal Server Error',
    response?: any,
  ) {
    super(statusCode, message, response);
    this.name = 'ServerException';
  }
}
