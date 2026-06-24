/**
 * Fox eCommerce SDK
 * Main Entry Point
 * 
 * Architecture Layers (Similar to Flutter PMS):
 * - common/      ← Types, Utils, Config
 * - domain/      ← Business Logic (Services, Repositories)
 * - data/        ← Data Layer (API, Storage)
 * - presentation/← UI Components & Screens
 * - modules/     ← Feature Modules
 * - di/          ← Dependency Injection
 */

// Config & Initialization
export { appConfig } from '@/config/app.config';
export { initializeApp, resetApp } from '@/config/app.init';

// Common (Types, Utils, Config)
export * from '@/common/types';
export { envConfig } from '@/common/config/env.config';

// DI Container
export { di, DIContainer } from '@/di';

// Modules
export * from '@/modules';

// Version
export const SDK_VERSION = '0.1.0';
export const SDK_NAME = 'Fox eCommerce SDK';

console.log(`🚀 ${SDK_NAME} v${SDK_VERSION}`);
