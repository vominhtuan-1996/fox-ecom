/**
 * Common Types
 * Shared types across the SDK
 */

// Re-export auth types
export * from '@/common/types/auth.types';

// API Error types
export interface ApiError {
  code: string;
  message: string;
  status: number;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Status
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  error?: string;
}
