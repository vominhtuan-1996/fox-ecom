/**
 * Fox eCommerce SDK
 * React Native SDK for e-commerce
 */

// Presentation layer (Components, Hooks)
export { ProductCard } from './presentation/components';
export { Cart as CartComponent } from './presentation/components';
export * from './presentation/hooks';

// Domain layer (Entities, Use cases, Repositories)
export * from './domain';

// Common utilities, constants, errors, types
export * from './common';

// Dependency Injection
export { setupDependencies, ServiceLocator } from './di';

// Auth exports
export { authService, AuthService } from '@/domain/services/auth.service';
export { useAuth } from '@/presentation/hooks/useAuth';
export { AuthInterceptor } from '@/data/sources/interceptors/auth_interceptor';
export { envConfig, type EnvConfig } from '@/common/config/env.config';
export type {
  AuthCredentials,
  AuthToken,
  AuthUser,
  AuthSession,
  AuthExtra,
  AuthConfig,
  AuthResponse,
  TokenPayload,
} from '@/common/types/auth.types';
