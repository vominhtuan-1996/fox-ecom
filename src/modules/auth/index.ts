/**
 * Auth Module
 * Authentication feature module (replaces Flutter's login module)
 */

export { AuthService, authService } from './services/AuthService';
export { useAuth } from './hooks/useAuth';
export type {
  AuthCredentials,
  AuthToken,
  AuthUser,
  AuthSession,
  AuthExtra,
  AuthState,
  AuthConfig,
  AuthResponse,
  TokenPayload,
} from './types/auth.types';
