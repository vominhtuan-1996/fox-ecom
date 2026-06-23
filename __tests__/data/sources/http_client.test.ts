import { HttpClient } from '../../../src/data/sources/http_client';
import {
  HttpException,
  UnauthorizedException,
  NotFoundException,
} from '../../../src/data/sources/http_error';

describe('HttpClient', () => {
  let client: HttpClient;

  beforeEach(() => {
    client = new HttpClient({
      baseURL: 'https://api.test.com',
      timeout: 5000,
      retryAttempts: 2,
    });
  });

  describe('constructor', () => {
    it('should initialize with default config', () => {
      const defaultClient = new HttpClient();
      expect(defaultClient).toBeDefined();
    });

    it('should initialize with custom config', () => {
      expect(client).toBeDefined();
    });
  });

  describe('setAuthToken', () => {
    it('should set auth token', () => {
      client.setAuthToken('test-token');
      expect(client).toBeDefined();
    });
  });

  describe('buildUrl', () => {
    it('should build full URL with baseURL', () => {
      const url = (client as any).buildUrl('/products');
      expect(url).toBe('https://api.test.com/products');
    });

    it('should return absolute URL as-is', () => {
      const url = (client as any).buildUrl('https://other.com/api');
      expect(url).toBe('https://other.com/api');
    });
  });

  describe('mapStatusException', () => {
    it('should map 401 to UnauthorizedException', () => {
      const error = (client as any).mapStatusException(401, { message: 'Unauthorized' });
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.statusCode).toBe(401);
    });

    it('should map 404 to NotFoundException', () => {
      const error = (client as any).mapStatusException(404, { message: 'Not Found' });
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.statusCode).toBe(404);
    });

    it('should map unknown status to HttpException', () => {
      const error = (client as any).mapStatusException(418, { message: 'Teapot' });
      expect(error).toBeInstanceOf(HttpException);
      expect(error.statusCode).toBe(418);
    });
  });
});
