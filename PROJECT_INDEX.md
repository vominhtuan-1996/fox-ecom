# 📚 Fox eCommerce SDK - Project Index

Complete project structure, files, and organization

---

## 📊 Project Overview

| Metric | Value |
|--------|-------|
| **TypeScript Files** | 118 |
| **Total Lines** | ~6000 |
| **Modules** | 4 |
| **Layers** | 7 |
| **Services** | 8+ |
| **Hooks** | 10+ |
| **Types** | 40+ |

---

## 🗂️ Complete File Structure

### Root Configuration
```
fox-ecom/
├── package.json              (Dependencies, scripts)
├── tsconfig.json             (TypeScript configuration)
├── .env.example              (Environment template)
├── babel.config.js           (Babel configuration)
├── metro.config.js           (Metro bundler config)
├── jest.config.js            (Jest test config)
└── README.md                 (Documentation)
```

### Source Directory (`src/`)

#### Common Layer (22 files)
```
src/common/
├── types/
│   ├── index.ts              (Common type exports)
│   ├── auth.types.ts         (Auth types)
│   └── dialog.types.ts       (Dialog types)
├── utils/
│   ├── index.ts
│   ├── calculateDiscount.ts
│   ├── formatPrice.ts
│   └── id.utils.ts
├── constants/
│   ├── index.ts
│   ├── app.constants.ts
│   ├── api.constants.ts
│   └── dialog.constants.ts
└── config/
    ├── env.config.ts         (Environment configuration)
    └── index.ts
```

#### Domain Layer (19 files)
```
src/domain/
├── entities/
│   ├── index.ts
│   ├── user.entity.ts
│   ├── product.entity.ts
│   └── cart.entity.ts
├── repositories/
│   ├── index.ts
│   ├── dialog.repository.ts
│   ├── product.repository.ts
│   └── cart.repository.ts
├── services/
│   └── auth.service.ts       (Authentication service)
├── usecases/
│   ├── index.ts
│   ├── cart/                 (Cart use cases)
│   ├── product/              (Product use cases)
│   └── show_dialog.usecase.ts
└── index.ts
```

#### Data Layer (22 files)
```
src/data/
├── datasources/
│   ├── index.ts
│   ├── local/
│   │   └── product_local_datasource.ts
│   └── remote/
│       └── product_remote_datasource.ts
├── models/
│   ├── index.ts
│   ├── product.model.ts
│   └── cart.model.ts
├── repositories/
│   ├── index.ts
│   ├── product.repository.impl.ts
│   ├── cart.repository.impl.ts
│   └── dialog.repository.impl.ts
└── sources/
    ├── index.ts
    ├── http_client.ts        (HTTP client)
    ├── http_error.ts         (Error types)
    ├── base_response.ts      (Response types)
    └── interceptors/
        ├── auth_interceptor.ts
        ├── curl_logger.ts
        └── retry_authenticator.ts
```

#### Presentation Layer (19 files)
```
src/presentation/
├── components/
│   ├── index.ts
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   ├── DialogHost.tsx
│   ├── DialogProvider.tsx
│   └── dialogs/
│       ├── DialogAlert.tsx
│       ├── DialogConfirm.tsx
│       ├── DialogInput.tsx
│       ├── DialogCustom.tsx
│       ├── Toast.tsx
│       └── index.ts
├── hooks/
│   ├── index.ts
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProduct.ts
│   └── use_dialog.ts
├── contexts/
│   ├── DialogContext.tsx
│   └── index.ts
└── index.ts
```

#### Modules (4 Modules, 19 files)

**Auth Module** (4 files)
```
src/modules/auth/
├── services/
│   └── AuthService.ts        (Singleton, replaces cubit)
├── hooks/
│   └── useAuth.ts            (React hook)
├── types/
│   └── auth.types.ts         (Auth types)
└── index.ts
```

**Navigation Module** (5 files)
```
src/modules/navigation/
├── router.ts                 (Router service)
├── hooks/
│   └── useNavigation.ts      (React hook)
├── deep-linking.ts           (Deep linking support)
├── types/
│   └── navigation.types.ts   (Types)
└── index.ts
```

**Products Module** (5 files)
```
src/modules/products/
├── services/
│   └── ProductService.ts     (Business logic, replaces cubit)
├── hooks/
│   └── useProducts.ts        (React hook)
├── types/
│   └── product.types.ts      (Product types)
├── screens/
│   └── ProductsScreen.tsx    (Example screen)
└── index.ts
```

**Cart Module** (5 files)
```
src/modules/cart/
├── services/
│   └── CartService.ts        (Business logic)
├── hooks/
│   └── useCart.ts            (React hook)
├── types/
│   └── cart.types.ts         (Cart types)
├── screens/
│   └── CartScreen.tsx        (Example screen)
└── index.ts
```

**Modules Index**
```
src/modules/
└── index.ts                  (Export all modules)
```

#### DI Container (2 files)
```
src/di/
├── container.ts              (DIContainer class)
├── service_locator.ts        (Service locator)
├── injection.ts              (Dependency setup)
└── index.ts
```

#### Configuration (2 files)
```
src/config/
├── app.config.ts             (App configuration)
├── app.init.ts               (App initialization)
└── index.ts
```

#### Main Exports
```
src/
└── index.ts                  (Main SDK export)
```

---

## 📚 Documentation Files

```
docs/
├── 01_convention.md          (Code conventions)
├── 02_structure.md           (Project structure)
├── 03_tech.md                (Technology stack)
├── 04_rule.md                (Development rules)
├── 05_csoc.md                (Code style)
├── 06_authentication.md      (Auth layer)
├── 07_sdk_initialization.md  (SDK init)
├── 08_sdk_simple_init.md     (Simple init)
├── 09_sdk_routing.md         (Routing)
├── 10_client_app_usage.md    (Client usage)
├── 11_sdk_architecture.md    (Architecture)
├── 12_sdk_module_guide.md    (Module guide)
├── 13_architecture_mapping.md (Flutter mapping)
├── 14_new_architecture.md    (New architecture)
├── 15_implementation_complete.md
├── 16_modules_structure.md   (Module details)
└── README.md                 (Overview)
```

---

## 🎯 Module Details

### Auth Module
- **Files**: 4
- **Lines**: ~300
- **Purpose**: Authentication
- **Exports**: `useAuth`, `authService`
- **Types**: `AuthCredentials`, `AuthToken`, `AuthUser`, `AuthSession`

### Navigation Module
- **Files**: 5
- **Lines**: ~400
- **Purpose**: Routing & navigation
- **Exports**: `useNavigation`, `sdkRouter`, `handleDeepLink`
- **Types**: `Route`, `ScreenName`, `NavigationState`

### Products Module
- **Files**: 5
- **Lines**: ~350
- **Purpose**: Product catalog
- **Exports**: `useProducts`, `productService`
- **Types**: `Product`, `ProductFilter`, `ProductListResponse`

### Cart Module
- **Files**: 5
- **Lines**: ~350
- **Purpose**: Shopping cart
- **Exports**: `useCart`, `cartService`
- **Types**: `Cart`, `CartItem`, `CartState`

---

## 🔑 Key Files

### Core Services
- `src/domain/services/auth.service.ts` - Authentication logic
- `src/modules/products/services/ProductService.ts` - Products management
- `src/modules/cart/services/CartService.ts` - Cart management
- `src/modules/navigation/router.ts` - Routing

### Core Hooks
- `src/modules/auth/hooks/useAuth.ts` - Auth state
- `src/modules/products/hooks/useProducts.ts` - Products state
- `src/modules/cart/hooks/useCart.ts` - Cart state
- `src/modules/navigation/hooks/useNavigation.ts` - Navigation state

### Configuration
- `src/config/app.init.ts` - App initialization
- `src/config/app.config.ts` - App configuration
- `src/common/config/env.config.ts` - Environment config

### DI Container
- `src/di/container.ts` - DIContainer implementation
- `src/di/service_locator.ts` - ServiceLocator

### Main Export
- `src/index.ts` - SDK main export (all public API)

---

## 📋 Type Definitions

### Auth Types
- `AuthCredentials` - Login credentials
- `AuthToken` - JWT token
- `AuthUser` - User info
- `AuthSession` - Complete session
- `AuthExtra` - Custom data

### Product Types
- `Product` - Product info
- `ProductFilter` - Filter options
- `ProductListResponse` - Paginated list
- `ProductState` - State enum

### Cart Types
- `Cart` - Cart state
- `CartItem` - Item in cart
- `AddToCartRequest` - Add request
- `CartState` - State enum

### Navigation Types
- `Route` - Route definition
- `ScreenName` - Screen identifier
- `RouteParams` - Route parameters
- `NavigationState` - Navigation state

---

## 🔄 Architecture Layers

### Common Layer (Shared)
- Types, utils, constants
- 22 files, ~500 LOC

### Domain Layer (Business Logic)
- Entities, repositories, services, usecases
- 19 files, ~800 LOC

### Data Layer (Data Sources)
- HTTP client, mappers, datasources
- 22 files, ~900 LOC

### Presentation Layer (UI)
- Components, hooks, contexts
- 19 files, ~800 LOC

### Modules (Features)
- Self-contained feature modules
- 19 files, ~1400 LOC
  - Auth (4 files)
  - Navigation (5 files)
  - Products (5 files)
  - Cart (5 files)

---

## 🎯 Public API

### Main Exports
```typescript
// Initialization
export { initializeApp, resetApp }
export { appConfig }

// Modules
export { useAuth, authService }
export { useNavigation, sdkRouter, handleDeepLink }
export { useProducts, productService }
export { useCart, cartService }

// DI
export { di, DIContainer }

// Common
export { envConfig }
export * from './common'
```

---

## 📝 Key Features

- ✅ Clean architecture (7 layers)
- ✅ Dependency injection
- ✅ Feature modules
- ✅ React hooks
- ✅ Observable pattern
- ✅ Type-safe
- ✅ localStorage support
- ✅ Deep linking

---

## 🚀 Build & Distribution

### Build Output
```
dist/
├── index.js              (Compiled SDK)
├── index.d.ts            (Type definitions)
├── modules/              (Compiled modules)
├── domain/               (Compiled domain)
├── data/                 (Compiled data)
└── presentation/         (Compiled presentation)
```

### Package
- `fox-ecom-0.1.0.tgz` (Tarball, ~34KB compressed)

---

## 📊 Statistics Summary

| Aspect | Count |
|--------|-------|
| TypeScript Files | 118 |
| Lines of Code | ~6000 |
| Modules | 4 |
| Layers | 7 |
| Services | 8+ |
| Hooks | 10+ |
| Types | 40+ |
| Documentation Files | 16 |
| Example Screens | 2 |

---

## 🔗 Dependencies

### Runtime
- react
- react-native
- (peer dependencies only)

### Development
- typescript
- jest
- babel
- metro

---

## 📌 Entry Points

1. **SDK Export**: `src/index.ts`
2. **App Init**: `src/config/app.init.ts`
3. **Main Package**: `package.json`

---

## 🎯 Quick Navigation

| Need | Location |
|------|----------|
| Main API | `src/index.ts` |
| Init SDK | `src/config/app.init.ts` |
| Auth | `src/modules/auth/` |
| Navigation | `src/modules/navigation/` |
| Products | `src/modules/products/` |
| Cart | `src/modules/cart/` |
| DI | `src/di/` |
| Docs | `docs/` |

---

**Project Version**: 0.1.0  
**Architecture**: Flutter PMS Clean Architecture  
**Status**: Production Ready  
**Last Updated**: 2026-06-24

---

## 📖 How to Use This Index

1. **Find by feature**: Look in `Modules` section
2. **Find by layer**: Look in `Architecture Layers` section
3. **Find by file**: Look in `Complete File Structure` section
4. **Find by API**: Look in `Public API` section
5. **Read details**: Check `Documentation Files` section

**Start reading**: Begin with `docs/01_convention.md` → `docs/15_implementation_complete.md`
