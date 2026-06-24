# 🏗️ SDK New Architecture (Flutter PMS Style)

Fox eCommerce SDK restructured to match Flutter PMS architecture

---

## 📦 New Folder Structure

```
src/
├── common/                  ← Shared Types, Utils, Config
│   ├── types/              (Common types)
│   ├── utils/              (Utility functions)
│   ├── constants/          (Constants)
│   ├── config/             (Configuration)
│   └── index.ts
│
├── domain/                  ← Business Logic Layer
│   ├── entities/           (Data entities)
│   ├── repositories/       (Repository interfaces)
│   ├── services/           (Business services)
│   ├── usecases/           (Use case logic)
│   └── index.ts
│
├── data/                    ← Data Layer
│   ├── sources/            (API client, storage)
│   ├── mappers/            (DTO ↔ Entity mapping)
│   ├── repositories/       (Repository implementations)
│   └── index.ts
│
├── presentation/            ← Presentation Layer
│   ├── components/         (Reusable components)
│   ├── screens/            (Screen components)
│   ├── hooks/              (Custom React hooks)
│   ├── contexts/           (Context providers)
│   └── index.ts
│
├── modules/                 ← Feature Modules
│   ├── auth/               (Authentication)
│   │   ├── screens/
│   │   ├── hooks/          (useAuth)
│   │   ├── types/
│   │   ├── services/
│   │   └── index.ts
│   ├── products/           (Products feature)
│   ├── cart/               (Cart feature)
│   ├── navigation/         (Navigation/Routing)
│   └── index.ts
│
├── di/                      ← Dependency Injection
│   ├── container.ts        (DI container class)
│   └── index.ts
│
├── config/                  ← App Configuration
│   ├── app.config.ts       (App settings)
│   ├── app.init.ts         (App initialization)
│   └── index.ts
│
└── index.ts                 ← Main SDK Export
```

---

## 🎯 Layer Responsibilities

### Common Layer
- Shared types across SDK
- Utility functions
- Constants and helpers
- Configuration

### Domain Layer (Business Logic)
- Business entities
- Repository interfaces
- Business services
- Use case logic
- **No external dependencies**

### Data Layer
- API clients
- Storage implementations
- DTO to Entity mapping
- Repository implementations

### Presentation Layer
- React components
- React hooks (state management)
- Screen components
- Context providers

### Modules (Features)
- Complete feature implementation
- Combines all layers
- Module-specific logic
- Self-contained

### DI Container
- Service registration
- Dependency resolution
- Singleton & factory patterns

---

## 🔄 Dependency Direction

```
Presentation (UI)
    ↓ depends on
Modules (Features)
    ↓ depends on
Domain (Business Logic)
    ↓ depends on
Data (Data Sources)
    ↓ depends on
Common (Types, Utils)

DI Container ← manages all layers
```

---

## 📝 Module Structure (Auth Example)

```
modules/auth/
├── index.ts                    (exports)
│
├── services/
│   └── AuthService.ts          (business logic, replaces cubit)
│
├── hooks/
│   └── useAuth.ts              (React hook, replaces state management)
│
├── types/
│   └── auth.types.ts           (type definitions)
│
└── screens/
    └── LoginScreen.tsx         (React component)
```

### File Purposes

**AuthService.ts** (Replaces Flutter Cubit)
- Singleton service
- Manages auth state
- Handles auth logic
- Observable pattern

**useAuth.ts** (React Integration)
- Custom React hook
- Returns state & methods
- Subscribes to service changes
- Used in components

**auth.types.ts** (Type Definitions)
- AuthCredentials, AuthToken
- AuthUser, AuthSession
- AuthState enum

**LoginScreen.tsx** (UI Component)
- React component
- Uses useAuth hook
- Renders UI

---

## 🎯 Naming Convention

| Flutter | React Native | Purpose |
|---------|--------------|---------|
| `login_cubit.dart` | `useAuth.ts` | State management |
| `LoginState` | `AuthState` type | State definition |
| `login_repository.dart` | `AuthRepository.ts` | Data access |
| `login_service.dart` | `AuthService.ts` | Business logic |
| `login_screen.dart` | `LoginScreen.tsx` | UI |
| `login_mappers.dart` | `authMapper.ts` | DTO mapping |

---

## 🔌 Dependency Injection (DI)

### DI Container (like Flutter's GetIt)

```typescript
import { di } from 'fox-ecom';

// Register singleton
di.registerSingleton('authService', new AuthService());

// Register lazy singleton
di.registerLazySingleton('authRepo', (get) => {
  return new AuthRepository(get('httpClient'));
});

// Register factory (new each time)
di.registerFactory('loginCubit', () => {
  return new LoginCubit(di.get('authRepo'));
});

// Get service
const authService = di.get('authService');
```

### App Initialization

```typescript
import { initializeApp } from 'fox-ecom';

// Initialize before rendering app
await initializeApp({
  environment: 'production',
  apiBaseUrl: 'https://api.foxecom.com'
});
```

---

## 📱 Usage Pattern

### Step 1: Initialize App
```typescript
import { initializeApp } from 'fox-ecom';

await initializeApp({
  token: 'your-token',
  environment: 'production'
});
```

### Step 2: Use Modules
```typescript
import { useAuth } from 'fox-ecom';

function LoginScreen() {
  const { session, login } = useAuth();
  
  return (
    <div>
      {/* UI */}
    </div>
  );
}
```

### Step 3: Register Routes
```typescript
import { sdkRouter } from 'fox-ecom';

sdkRouter.registerRoutes([
  { name: 'login', path: '/login', component: LoginScreen }
]);
```

---

## 🎭 Architecture Comparison

### Before (Simple 3 Modules)
```
sdk/
├── core/ ← all core logic
├── ui/   ← UI only
└── navigation/ ← routing only
```

### After (Clean Architecture)
```
common/        ← shared types
domain/        ← business logic
data/          ← data sources
presentation/  ← UI components
modules/       ← features
  ├── auth/
  ├── products/
  └── navigation/
di/            ← dependency injection
config/        ← app configuration
```

---

## ✨ Benefits

✅ **Clean Architecture** - Clear separation of concerns
✅ **Scalable** - Easy to add new features
✅ **Testable** - Each layer can be tested independently
✅ **Maintainable** - Clear responsibilities
✅ **Similar to Flutter** - Familiar architecture
✅ **Modular** - Features are self-contained
✅ **DI Support** - Proper dependency management

---

## 🔄 Migration Path

### From Old to New

**Old:**
```typescript
import { initSDK, useNavigation, useDialog } from 'fox-ecom/core';
```

**New:**
```typescript
import { initializeApp } from 'fox-ecom';
import { useNavigation } from 'fox-ecom/modules/navigation';
import { useAuth } from 'fox-ecom/modules/auth';
```

### Gradual Migration

1. New code uses new architecture
2. Old code still works
3. Migrate piece by piece
4. Eventually remove old SDK

---

## 📚 File Organization Examples

### Service (Business Logic)
```typescript
// modules/auth/services/AuthService.ts
class AuthServiceImpl {
  async login(credentials: AuthCredentials): Promise<AuthUser> {
    // Business logic
  }
  
  async logout(): Promise<void> {
    // Business logic
  }
}
```

### Hook (React Integration)
```typescript
// modules/auth/hooks/useAuth.ts
export function useAuth() {
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    const unsubscribe = authService.subscribe((newSession) => {
      setSession(newSession);
    });
    return unsubscribe;
  }, []);
  
  return { session, login: authService.login };
}
```

### Component (UI)
```typescript
// modules/auth/screens/LoginScreen.tsx
export function LoginScreen() {
  const { login, session } = useAuth();
  
  return (
    <div>
      {/* UI */}
    </div>
  );
}
```

---

## 🚀 Next Steps

1. ✅ Create folder structure
2. ✅ Create DI container
3. ✅ Create core modules (auth, navigation)
4. ⏳ Migrate existing code
5. ⏳ Add products module
6. ⏳ Add cart module
7. ⏳ Complete documentation
8. ⏳ Update examples

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24
