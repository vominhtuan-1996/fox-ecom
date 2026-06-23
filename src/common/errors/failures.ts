export class Failure extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NetworkFailure extends Failure {
  constructor(message: string = 'Network error') {
    super(message);
  }
}

export class CacheFailure extends Failure {
  constructor(message: string = 'Cache error') {
    super(message);
  }
}

export class ValidationFailure extends Failure {
  constructor(message: string = 'Validation error') {
    super(message);
  }
}

export class NotFoundFailure extends Failure {
  constructor(message: string = 'Not found') {
    super(message);
  }
}
