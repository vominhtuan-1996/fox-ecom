/**
 * SDK Initialization Middleware
 * Validates token, sets environment, builds API domain
 */

import { AppContext, AppContextConfig, createAppContext, validateAppContext } from '@/sdk/config/app-context';
import { tokenValidator } from '@/sdk/services/token-validator.service';

export interface SDKInitRequest {
  token: string;
  environment: 'development' | 'staging' | 'production';
  scheme: 'http' | 'https';
  domain?: string;
  extra?: Record<string, any>;
}

export interface SDKInitResponse {
  success: boolean;
  context?: AppContext;
  error?: string;
  message: string;
}

/**
 * Initialize SDK cho app
 */
export async function initializeSDK(request: SDKInitRequest): Promise<SDKInitResponse> {
  try {
    // Validate input
    if (!request.token) {
      return {
        success: false,
        error: 'MISSING_TOKEN',
        message: 'Token is required',
      };
    }

    if (!request.environment) {
      return {
        success: false,
        error: 'MISSING_ENVIRONMENT',
        message: 'Environment is required (development|staging|production)',
      };
    }

    if (!request.scheme) {
      return {
        success: false,
        error: 'MISSING_SCHEME',
        message: 'Scheme is required (http|https)',
      };
    }

    // Validate token
    const tokenResult = tokenValidator.validate(request.token);
    if (!tokenResult.valid) {
      return {
        success: false,
        error: tokenResult.error || 'INVALID_TOKEN',
        message: tokenResult.message,
      };
    }

    // Get app info
    const appInfo = tokenValidator.getAppInfo(request.token);
    if (!appInfo) {
      return {
        success: false,
        error: 'APP_NOT_FOUND',
        message: 'App not found for this token',
      };
    }

    // Create app context
    const contextConfig: AppContextConfig = {
      appId: appInfo.appId,
      token: request.token,
      environment: request.environment,
      scheme: request.scheme,
      domain: request.domain,
      extra: {
        ...request.extra,
        permissions: appInfo.permissions,
      },
    };

    const context = createAppContext(contextConfig);

    // Validate context
    if (!validateAppContext(context)) {
      return {
        success: false,
        error: 'CONTEXT_INVALID',
        message: 'Failed to create valid app context',
      };
    }

    console.log('✅ SDK initialized for app:', {
      appId: context.appId,
      environment: context.environment,
      apiBaseUrl: context.apiBaseUrl,
    });

    return {
      success: true,
      context,
      message: `SDK initialized for ${appInfo.appId}`,
    };
  } catch (error: any) {
    console.error('❌ SDK initialization error:', error.message);
    return {
      success: false,
      error: 'INIT_ERROR',
      message: `Initialization failed: ${error.message}`,
    };
  }
}

/**
 * Middleware để validate request
 * (cho Express/Fastify)
 */
export function createSDKMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      const token = req.headers['x-sdk-token'] || req.body?.token;
      const environment = req.headers['x-sdk-environment'] || req.body?.environment;
      const scheme = req.headers['x-sdk-scheme'] || req.body?.scheme || 'https';

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'MISSING_TOKEN',
          message: 'SDK token is required',
        });
      }

      // Validate token
      const result = tokenValidator.validate(token);
      if (!result.valid) {
        return res.status(401).json({
          success: false,
          error: result.error,
          message: result.message,
        });
      }

      // Initialize SDK
      const initResponse = await initializeSDK({
        token,
        environment: environment || 'production',
        scheme,
      });

      if (!initResponse.success) {
        return res.status(400).json(initResponse);
      }

      // Attach context to request
      req.sdkContext = initResponse.context;
      req.appId = initResponse.context?.appId;

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'MIDDLEWARE_ERROR',
        message: error.message,
      });
    }
  };
}

/**
 * Extract context từ request
 */
export function getSDKContext(req: any): AppContext | null {
  return req.sdkContext || null;
}

/**
 * Get API Base URL từ context
 */
export function getAPIBaseUrl(context: AppContext): string {
  return context.apiBaseUrl;
}
