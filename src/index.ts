/**
 * Fox eCommerce SDK
 * React Native SDK for e-commerce
 *
 * Architecture Layers:
 * - common/      (Shared types, utils, config)
 * - domain/      (Business logic - services, repositories, entities)
 * - data/        (Data layer - API, storage, mappers)
 * - presentation/(UI - components, screens, hooks, contexts)
 * - modules/     (Feature modules - auth, products, cart, navigation)
 * - di/          (Dependency Injection container)
 * - config/      (App configuration & initialization)
 */

// ============================================================
// CONFIG & INITIALIZATION
// ============================================================
export { appConfig } from './config/app.config';
// Note: initializeApp/resetApp are app-level, not exported from package
// Apps should provide their own initialization logic
export { FoxComAuthen } from './FoxComAuthen';
export type { FoxComAuthenConfig } from './FoxComAuthen';

// ============================================================
// COMMON (Shared Types, Utils, Config)
// ============================================================
export * from './common';

// ============================================================
// DOMAIN LAYER (Business Logic)
// ============================================================
export * from './domain';

// ============================================================
// DATA LAYER (API, Storage, Mappers)
// ============================================================
export * from './data';

// ============================================================
// PRESENTATION LAYER (UI Components, Hooks, Contexts)
// ============================================================
export { ProductCard } from './presentation/components';
export { Cart as CartComponent } from './presentation/components';
export * from './presentation/components/engine_dialog';
export { LoadingAnimationWidget } from './presentation/components/LoadingAnimation';
export { SvgIcon } from './presentation/components/SvgIcon';
export * from './presentation/components/multi_select';
export { Navigator } from './presentation/navigator/Navigator';
export { LauncherScreen } from './presentation/screens/LauncherScreen';
export { HomeScreen } from './presentation/screens/home/HomeScreen';

// ============================================================
// ============================================================
// ASSETS (Static Assets & Configurations)
// ============================================================
export * from './assets';

// ============================================================
// MODULES (Feature Modules)
// ============================================================
// Modules are exported, but we need to be careful about duplicates
// Auth module exports are available from ./modules/auth
export { useAuth, authService } from './modules/auth';
export { useNavigation, sdkRouter } from './modules/navigation';
export { useProducts, productService } from './modules/products';
export { useCart, cartService } from './modules/cart';

// ============================================================
// DI CONTAINER (Dependency Injection)
// ============================================================
export { di, DIContainer } from './di';
export { setupDependencies, ServiceLocator } from './di';

// ============================================================
// SDK INFO
// ============================================================
export const SDK_VERSION = '0.1.0';
export const SDK_NAME = 'Fox eCommerce SDK';

console.log(`🚀 ${SDK_NAME} v${SDK_VERSION}`);
