/**
 * Auth Module
 * Authentication feature module
 */

export { useAuth } from './hooks/useAuth';
export { authService } from './services/AuthService';
export type {
  AuthCredentials,
  AuthToken,
  AuthUser,
  AuthSession,
  AuthExtra,
} from './types/auth.types';
