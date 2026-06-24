import { authService } from '@/domain/services/auth.service';
import { envConfig } from '@/common/config/env.config';

/**
 * Auth Interceptor
 * Injects authentication token into HTTP requests
 */
export class AuthInterceptor {
  static async intercept(request: Request): Promise<Request> {
    const token = authService.getAccessToken();

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }

    // Add custom headers
    request.headers.set('X-App-Version', String(envConfig.get('appVersion')));
    request.headers.set('X-Client-Type', 'sdk');

    // Add extra data to headers if needed
    const extra = authService.getExtra();
    if (extra.deviceId) {
      request.headers.set('X-Device-Id', extra.deviceId);
    }
    if (extra.userId) {
      request.headers.set('X-User-Id', extra.userId);
    }

    if (envConfig.isDevelopment()) {
      console.log('🔐 Request intercepted:', {
        url: request.url,
        hasAuth: !!token,
        extra: Object.keys(extra),
      });
    }

    return request;
  }

  static async interceptResponse(response: Response): Promise<Response> {
    // Handle 401 - token expired
    if (response.status === 401) {
      const refreshed = await authService.refreshToken();

      if (refreshed) {
        // Retry original request
        if (envConfig.isDevelopment()) {
          console.log('🔄 Token refreshed, retrying request');
        }
        return response;
      } else {
        // Token refresh failed, logout
        if (envConfig.isDevelopment()) {
          console.log('❌ Token refresh failed, logging out');
        }
        await authService.logout();
      }
    }

    if (envConfig.isDevelopment()) {
      console.log('📡 Response status:', response.status);
    }

    return response;
  }
}
