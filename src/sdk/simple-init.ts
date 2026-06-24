/**
 * Simple SDK Initialization
 * Token + Environment + Extra Data
 */

export interface SDKInitConfig {
  token: string;
  environment: 'development' | 'staging' | 'production';
  extra?: Record<string, any>;
}

export interface SDKInitResult {
  success: boolean;
  token: string;
  environment: string;
  extra: Record<string, any>;
  apiBaseUrl: string;
  error?: string;
}

/**
 * Store initialized SDK state
 */
let sdkState: SDKInitResult | null = null;

/**
 * Initialize SDK with token + env + extra
 */
export async function initSDK(config: SDKInitConfig): Promise<SDKInitResult> {
  try {
    // Validate token
    if (!config.token || typeof config.token !== 'string') {
      throw new Error('Invalid token');
    }

    // Validate environment
    if (!['development', 'staging', 'production'].includes(config.environment)) {
      throw new Error('Invalid environment');
    }

    // Get API domain from environment variables
    const apiBaseUrl = process.env[`REACT_APP_API_URL_${config.environment.toUpperCase()}`]
      || process.env.REACT_APP_API_BASE_URL
      || 'https://api.foxecom.com';

    // Create SDK state
    sdkState = {
      success: true,
      token: config.token,
      environment: config.environment,
      extra: config.extra || {},
      apiBaseUrl,
    };

    console.log('✅ SDK initialized:', {
      environment: config.environment,
      apiBaseUrl,
      extra: Object.keys(config.extra || {}),
    });

    return sdkState;
  } catch (error: any) {
    const result: SDKInitResult = {
      success: false,
      token: config.token,
      environment: config.environment,
      extra: config.extra || {},
      apiBaseUrl: '',
      error: error.message,
    };

    console.error('❌ SDK init error:', error.message);
    return result;
  }
}

/**
 * Get current SDK state
 */
export function getSDK(): SDKInitResult | null {
  return sdkState;
}

/**
 * Get token
 */
export function getToken(): string | null {
  return sdkState?.token || null;
}

/**
 * Get environment
 */
export function getEnvironment(): string | null {
  return sdkState?.environment || null;
}

/**
 * Get API base URL
 */
export function getAPIBaseUrl(): string | null {
  return sdkState?.apiBaseUrl || null;
}

/**
 * Get extra data
 */
export function getExtra(key?: string): any {
  if (!sdkState) return null;
  if (key) return sdkState.extra[key];
  return sdkState.extra;
}

/**
 * Set extra data
 */
export function setExtra(key: string, value: any): void {
  if (sdkState) {
    sdkState.extra[key] = value;
  }
}

/**
 * Check if initialized
 */
export function isInitialized(): boolean {
  return sdkState?.success === true;
}

/**
 * Reset SDK
 */
export function resetSDK(): void {
  sdkState = null;
}
