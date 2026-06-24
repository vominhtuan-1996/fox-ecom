# 🔄 Architecture Mapping: Flutter PMS → React Native SDK

Reference from Flutter PMS project structure to React Native equivalent

---

## 📊 Flutter PMS Structure

```
lib/
├── core/                    ← Business Logic Layer
│   ├── blocs/              (State Management)
│   ├── repos/              (Repositories)
│   ├── services/           (Services)
│   ├── rest_api/           (HTTP Client)
│   ├── config/             (Configuration)
│   ├── models/             (Data Models)
│   ├── constants/          (Constants)
│   ├── utils/              (Utilities)
│   ├── helpers/            (Helpers)
│   └── ...
│
├── modules/                ← Feature Modules
│   ├── login/              (Feature)
│   │   ├── cubit/          (State Management)
│   │   ├── screens/        (UI)
│   │   └── state/          (States)
│   ├── ticket/
│   ├── report/
│   └── ...
│
├── widgets/                ← Shared Components
│   ├── app_screens/
│   ├── carousel_image/
│   ├── detail_image/
│   └── ...
│
├── routes/                 ← Navigation
│   ├── page_routes.dart
│   └── app_route_observer.dart
│
├── communication/          ← Native Bridge
│   ├── flutter_method_channel.dart
│   ├── flutter_native_bridge.dart
│   └── ...
│
├── main.dart              ← App Entry
├── injector.dart          ← Dependency Injection
└── app_bloc.dart          ← Global State
```

---

## 🔀 React Native / TypeScript Equivalent

```
src/
├── common/                  ← Shared Types & Utils (= core utilities)
│   ├── types/              (TypeScript types)
│   ├── utils/              (Utility functions)
│   └── config/             (Configuration)
│
├── domain/                  ← Business Logic Layer (= core layer)
│   ├── repositories/       (Repositories = repos/)
│   ├── services/           (Services = services/)
│   ├── models/             (Models = models/)
│   ├── usecases/           (Use cases = logic)
│   └── entities/           (Data entities)
│
├── data/                    ← Data Layer
│   ├── sources/            (API clients = rest_api/)
│   │   └── interceptors/   (Interceptors)
│   ├── mappers/            (DTO ↔ Entity mapping)
│   └── remote/             (Remote data)
│
├── presentation/            ← UI Layer (= modules + widgets)
│   ├── screens/            (Screens = modules/*/screens/)
│   ├── components/         (Components = widgets/)
│   ├── hooks/              (Custom hooks = cubits/state management)
│   └── contexts/           (Context/providers)
│
├── modules/                 ← Feature Modules (= modules/)
│   ├── login/              (Feature)
│   │   ├── screens/        (UI screens)
│   │   ├── hooks/          (State management)
│   │   └── types/          (Feature types)
│   ├── products/
│   ├── cart/
│   └── ...
│
├── di/                      ← Dependency Injection (= injector.dart)
│   └── injection.ts        (DI setup)
│
├── navigation/              ← Navigation Layer (= routes/)
│   ├── router.ts
│   ├── types.ts
│   └── ...
│
├── index.ts                ← Main Export
└── main.tsx                ← App Entry (= main.dart)
```

---

## 📋 Layer Mapping

| Flutter Layer | Purpose | React Native Equivalent | Location |
|---------------|---------|------------------------|----------|
| **core/blocs/** | State management (Cubit) | Hooks + Context | `presentation/hooks/` |
| **core/repos/** | Data access logic | Repositories | `domain/repositories/` |
| **core/services/** | Business logic | Services | `domain/services/` |
| **core/rest_api/** | HTTP client | HTTP client | `data/sources/` |
| **core/models/** | Data models | Types/Interfaces | `common/types/` |
| **core/config/** | Configuration | Config | `common/config/` |
| **core/utils/** | Utilities | Utils | `common/utils/` |
| **modules/** | Features | Modules | `modules/` or `presentation/` |
| **modules/*/cubit/** | Feature state | Hooks | `modules/*/hooks/` |
| **modules/*/screens/** | Feature UI | Screens | `modules/*/screens/` |
| **widgets/** | Shared components | Components | `presentation/components/` |
| **routes/** | Navigation | Router | `navigation/` |
| **communication/** | Native bridge | Native modules | `native/` or `bridge/` |
| **injector.dart** | Dependency injection | DI container | `di/` |
| **app_bloc.dart** | Global state | Root context | `presentation/contexts/` |

---

## 🎯 Naming Conventions

### Flutter → React Native

```
// Flutter
login_cubit.dart          → useLogin.ts (hook)
login_state.dart          → loginState (types)
login_screen.dart         → LoginScreen.tsx (component)
user_repository.dart      → UserRepository (class)
user_service.dart         → userService (singleton)

// Flutter enum names
enum AuthState { loading, success, failure }

// React Native
useAuth()                 (hook)
type AuthState = 'loading' | 'success' | 'failure'
AuthRepository class      (class)
authService              (singleton)
```

---

## 🏗️ Architecture Layers

### Flutter (Clean Architecture)
```
┌────────────────────────────────┐
│   Presentation Layer           │
│  (Screens + Cubits)            │
├────────────────────────────────┤
│   Domain Layer                 │
│  (Entities + Repositories)     │
├────────────────────────────────┤
│   Data Layer                   │
│  (API + Local DB)              │
└────────────────────────────────┘
```

### React Native (Same Architecture)
```
┌────────────────────────────────┐
│   Presentation Layer           │
│  (Components + Hooks)          │
├────────────────────────────────┤
│   Domain Layer                 │
│  (Services + Repositories)     │
├────────────────────────────────┤
│   Data Layer                   │
│  (HTTP + Mappers)              │
└────────────────────────────────┘
```

---

## 💡 State Management Mapping

### Flutter Approach
```dart
// Cubit (like BLoC)
class LoginCubit extends Cubit<LoginState> {
  Future<void> login(String email, String password) async {
    emit(LoginLoading());
    try {
      final user = await _loginRepo.login(email, password);
      emit(LoginSuccess(user));
    } catch (e) {
      emit(LoginFailure(e.toString()));
    }
  }
}

// Usage in UI
BlocBuilder<LoginCubit, LoginState>(
  builder: (context, state) {
    if (state is LoginLoading) return LoadingWidget();
    if (state is LoginSuccess) return HomeScreen();
    if (state is LoginFailure) return ErrorWidget(state.error);
  }
)
```

### React Native Equivalent
```typescript
// Custom Hook (replaces Cubit)
export function useLogin() {
  const [state, setState] = useState<LoginState>('idle');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setState('loading');
    try {
      const user = await loginRepo.login(email, password);
      setUser(user);
      setState('success');
    } catch (e) {
      setError(e.message);
      setState('failure');
    }
  };

  return { state, user, error, login };
}

// Usage in UI
function LoginScreen() {
  const { state, user, error, login } = useLogin();

  if (state === 'loading') return <LoadingWidget />;
  if (state === 'success') return <HomeScreen />;
  if (state === 'failure') return <ErrorWidget error={error} />;
}
```

---

## 🔌 Module Structure Mapping

### Flutter Module (login example)
```
modules/login/
├── cubit/
│   └── login_cubit.dart
├── screens/
│   └── login_screen.dart
└── state/
    └── login_state.dart
```

### React Native Equivalent
```
modules/login/               OR      presentation/screens/login/
├── hooks/
│   └── useLogin.ts          ← replaces cubit
├── screens/
│   └── LoginScreen.tsx       ← replaces screen
└── types/
    └── login.types.ts       ← replaces state
```

---

## 📦 SDK Module Naming (React Native)

Following Flutter pattern with React Native conventions:

```
SDK
├── modules/
│   ├── core/                ← Business Logic (= Flutter core layer)
│   │   ├── auth/            (authentication module)
│   │   ├── config/          (configuration)
│   │   └── services/        (business services)
│   │
│   ├── ui/                  ← Presentation UI (= Flutter widgets)
│   │   ├── components/      (reusable components)
│   │   ├── dialogs/         (dialog components)
│   │   └── screens/         (screen templates)
│   │
│   ├── navigation/          ← Navigation (= Flutter routes)
│   │   ├── router.ts
│   │   └── types.ts
│   │
│   └── data/                ← Data Layer (= Flutter data layer)
│       ├── sources/         (API clients)
│       ├── mappers/         (DTO mapping)
│       └── repositories/    (repositories)
│
├── common/                  ← Shared (= Flutter core/utils)
│   ├── types/
│   ├── utils/
│   └── config/
│
└── index.ts                 ← Main export
```

---

## 🎯 Key Differences: Flutter vs React Native

| Aspect | Flutter | React Native |
|--------|---------|--------------|
| State Mgmt | Cubit/BLoC | Hooks + Context |
| Navigation | GoRouter/GetX | React Navigation/Router |
| Components | Widgets | Components (TSX/JSX) |
| Styling | ThemeData | CSS/StyleSheet |
| Lifecycle | Cubit events | useEffect |
| Navigation | Named routes | Route configs |
| DI | GetIt / service locator | Manual DI / factories |
| Types | Dart classes | TypeScript interfaces |

---

## 📝 File Organization in React Native

### Feature Module Structure
```
modules/login/
├── index.ts                          (exports)
├── hooks/
│   ├── useLogin.ts                   (state management)
│   ├── useLoginForm.ts
│   └── index.ts
├── screens/
│   ├── LoginScreen.tsx               (UI)
│   ├── ForgotPasswordScreen.tsx
│   └── index.ts
├── types/
│   ├── login.types.ts
│   └── index.ts
├── services/
│   ├── loginService.ts
│   └── index.ts
└── constants/
    ├── loginConstants.ts
    └── index.ts
```

---

## 🔄 Dependency Injection Mapping

### Flutter (GetIt)
```dart
final getIt = GetIt.instance;

void setupDependencies() {
  getIt.registerSingleton<AuthService>(AuthService());
  getIt.registerSingleton<LoginRepository>(LoginRepository());
  getIt.registerSingleton<LoginCubit>(LoginCubit(getIt()));
}

// Usage
final loginCubit = getIt<LoginCubit>();
```

### React Native TypeScript
```typescript
// Simple DI container
class DIContainer {
  private services: Map<string, any> = new Map();

  register<T>(name: string, instance: T): void {
    this.services.set(name, instance);
  }

  get<T>(name: string): T {
    return this.services.get(name);
  }
}

export const di = new DIContainer();

// Setup
di.register('authService', new AuthService());
di.register('loginRepo', new LoginRepository());

// Usage
const authService = di.get('authService');
```

---

## 🚀 Best Practice: From Flutter to React Native

1. **Structure** stays the same → layers separated
2. **Naming** adapts → camelCase in TS, PascalCase in components
3. **State Management** → Hooks replace Cubits
4. **Navigation** → Router service replaces named routes
5. **Types** → TypeScript replaces Dart types
6. **Components** → TSX/JSX replaces Widgets
7. **Services** → Singletons replace GetIt services

---

## 📚 Summary

**Flutter PMS Structure → React Native SDK Equivalent:**

- **core/** → `domain/` + `common/` (Business logic)
- **modules/** → `modules/` (Features)
- **widgets/** → `presentation/components/` (UI Components)
- **cubit/** → `hooks/` (State management)
- **routes/** → `navigation/` (Navigation)
- **rest_api/** → `data/sources/` (API client)
- **repos/** → `domain/repositories/` (Repositories)
- **injector.dart** → `di/` (Dependency injection)

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24
