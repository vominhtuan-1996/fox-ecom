/**
 * Configuration Assets
 * JSON configurations for SDK
 */

// API Endpoints configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.foxecom.example.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_BETA_FEATURES: false,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@FoxEcom:authToken',
  REFRESH_TOKEN: '@FoxEcom:refreshToken',
  USER_DATA: '@FoxEcom:userData',
  PREFERENCES: '@FoxEcom:preferences',
  CACHE: '@FoxEcom:cache',
} as const;

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_FAILED: 'AUTH_FAILED',
  INVALID_DATA: 'INVALID_DATA',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT',
  NOT_FOUND: 'NOT_FOUND',
} as const;

// Analytics events
export const ANALYTICS_EVENTS = {
  APP_OPENED: 'app_opened',
  APP_CLOSED: 'app_closed',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  CHECKOUT_STARTED: 'checkout_started',
  PURCHASE_COMPLETED: 'purchase_completed',
} as const;
