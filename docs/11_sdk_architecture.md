# 🏗️ SDK Modular Architecture

Fox eCommerce SDK - organized thành 3 sub-modules chính

---

## 📦 Module Structure

```
fox-ecom/
├── src/
│   ├── modules/
│   │   ├── core/              # Module 1: Core (Init + Auth + Config)
│   │   │   ├── index.ts
│   │   │   ├── init.ts        # SDK initialization
│   │   │   ├── auth.ts        # Authentication service
│   │   │   └── config.ts      # Environment config
│   │   │
│   │   ├── ui/                # Module 2: UI (Components + Dialogs)
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/
│   │   │   │   ├── useDialog.ts
│   │   │   │   ├── useToast.ts
│   │   │   │   └── ...
│   │   │   └── styles/
│   │   │
│   │   ├── navigation/        # Module 3: Navigation (Routing)
│   │   │   ├── index.ts
│   │   │   ├── router.ts      # Router service
│   │   │   ├── useNavigation.ts
│   │   │   ├── deep-linking.ts
│   │   │   └── types.ts
│   │   │
│   │   └── services/          # Shared services
│   │       ├── cart.ts
│   │       ├── products.ts
│   │       └── ...
│   │
│   ├── common/                # Shared types, utils
│   │   ├── types/
│   │   ├── utils/
│   │   └── config/
│   │
│   └── index.ts               # Main SDK export
│
├── package.json
└── README.md
```

---

## 🔧 Module Organization

### **Module 1: @fox-ecom/core**

**Responsibility:** SDK initialization, authentication, configuration

**File: `src/modules/core/index.ts`**

```typescript
// Core Module Exports
export { initSDK, getSDK } from './init';
export { authService, useAuth } from './auth';
export { envConfig } from './config';
export type { 
  SDKInitConfig, 
  SDKInitResult, 
  AuthConfig,
  EnvConfig 
} from './types';
```

**Usage:**
```typescript
import { initSDK, authService, envConfig } from '@fox-ecom/core';

await initSDK({
  token: 'xxx',
  environment: 'production',
  extra: { userId: 'user-123' }
});

const user = authService.getUser();
const apiUrl = envConfig.get('apiBaseUrl');
```

---

### **Module 2: @fox-ecom/ui**

**Responsibility:** UI components, dialogs, toasts

**File: `src/modules/ui/index.ts`**

```typescript
// UI Module Exports
export { Dialog, Toast, Button, Card } from './components';
export { useDialog, useToast } from './hooks';
export type { DialogConfig, ToastConfig } from './types';
```

**Usage:**
```typescript
import { useDialog, useToast, Button } from '@fox-ecom/ui';

function MyComponent() {
  const { alert, confirm } = useDialog();
  const { show } = useToast();

  return (
    <div>
      <Button onClick={() => alert({ title: 'Hello' })}>
        Show Alert
      </Button>
    </div>
  );
}
```

---

### **Module 3: @fox-ecom/navigation**

**Responsibility:** Routing, navigation, deep linking

**File: `src/modules/navigation/index.ts`**

```typescript
// Navigation Module Exports
export { sdkRouter } from './router';
export { useNavigation } from './useNavigation';
export { 
  handleDeepLink, 
  parseDeepLink, 
  createDeepLink 
} from './deep-linking';
export type { Route, ScreenName, RouteParams } from './types';
```

**Usage:**
```typescript
import { 
  sdkRouter, 
  useNavigation, 
  handleDeepLink 
} from '@fox-ecom/navigation';

function App() {
  const { navigate, currentRoute } = useNavigation();

  return (
    <div>
      {currentRoute === 'home' && <HomeScreen />}
      <button onClick={() => navigate('products')}>
        Go to Products
      </button>
    </div>
  );
}
```

---

## 🎯 Main SDK Export

**File: `src/index.ts`**

```typescript
/**
 * Fox eCommerce SDK - Main Entry Point
 */

// Core Module
export * from '@/modules/core';

// UI Module
export * from '@/modules/ui';

// Navigation Module
export * from '@/modules/navigation';

// Version
export const SDK_VERSION = '0.1.0';
```

---

## 📖 Module Dependencies

```
┌─────────────────────────────────────────┐
│      Client App                         │
├─────────────────────────────────────────┤
│           SDK (Main Export)             │
├──────────┬──────────┬───────────────────┤
│          │          │                   │
│  Core    │   UI     │  Navigation       │
│  Module  │  Module  │  Module           │
│          │          │                   │
├──────────┴──────────┴───────────────────┤
│    Common Types, Utils, Config          │
└─────────────────────────────────────────┘
```

---

## 🚀 Usage Patterns

### Pattern 1: Import from main SDK

```typescript
import { 
  initSDK,           // from core
  useDialog,         // from ui
  useNavigation      // from navigation
} from 'fox-ecom';
```

### Pattern 2: Import from specific module

```typescript
import { initSDK } from 'fox-ecom/core';
import { useDialog } from 'fox-ecom/ui';
import { useNavigation } from 'fox-ecom/navigation';
```

### Pattern 3: Module initialization

```typescript
// Initialize modules in order
import { initSDK } from 'fox-ecom/core';
import { sdkRouter } from 'fox-ecom/navigation';

// 1. Init core
await initSDK({ token, environment });

// 2. Register routes
sdkRouter.registerRoutes(routes);

// 3. Use UI & Navigation
```

---

## 📊 Module Responsibilities

| Module | Purpose | Exports | Dependencies |
|--------|---------|---------|--------------|
| **Core** | Init, Auth, Config | initSDK, authService, envConfig | None |
| **UI** | Components, Dialogs | useDialog, useToast, Button | core (for auth context) |
| **Navigation** | Routing, Deep linking | sdkRouter, useNavigation | core (for auth state) |

---

## 🔄 Module Communication

```typescript
// Core initializes auth
initSDK({ token: 'xxx' });

// UI uses auth from Core
const { user } = useAuth(); // from core

// Navigation uses auth from Core
const { navigate } = useNavigation();

// All have access to auth context
```

---

## 📦 Package.json Structure

```json
{
  "name": "fox-ecom",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./core": {
      "import": "./dist/modules/core/index.js",
      "types": "./dist/modules/core/index.d.ts"
    },
    "./ui": {
      "import": "./dist/modules/ui/index.js",
      "types": "./dist/modules/ui/index.d.ts"
    },
    "./navigation": {
      "import": "./dist/modules/navigation/index.js",
      "types": "./dist/modules/navigation/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "build:dev": "tsc --sourceMap",
    "pack": "npm pack"
  }
}
```

---

## ✅ Benefits

✅ **Modular** - Easy to maintain and update
✅ **Scalable** - Add new modules without touching existing
✅ **Selective Import** - App imports only what it needs
✅ **Clear Separation** - Each module has clear responsibility
✅ **Better Tree-Shaking** - Unused modules are eliminated
✅ **Easy Testing** - Test each module independently
✅ **Clear Dependencies** - Obvious what depends on what

---

## 🎯 Best Practices

### ✅ DO:
- Each module exports via index.ts
- Keep modules independent
- Use internal imports (from '@/modules/...')
- Document module purpose
- Test modules separately

### ❌ DON'T:
- Cross-module circular imports
- Expose internal module details
- Put everything in one file
- Skip module exports
- Mix concerns in one module

---

## 📝 Adding New Modules

### Step 1: Create module folder

```bash
mkdir src/modules/my-module
```

### Step 2: Create index.ts

```typescript
// src/modules/my-module/index.ts
export { MyFeature } from './my-feature';
export type { MyConfig } from './types';
```

### Step 3: Export from main SDK

```typescript
// src/index.ts
export * from '@/modules/my-module';
```

### Step 4: Add to package.json exports

```json
{
  "exports": {
    "./my-module": {
      "import": "./dist/modules/my-module/index.js",
      "types": "./dist/modules/my-module/index.d.ts"
    }
  }
}
```

---

## 🧪 Testing Modules

```typescript
// Test core module
describe('Core Module', () => {
  test('initSDK initializes successfully', async () => {
    await initSDK({ token: 'xxx', environment: 'test' });
    expect(getSDK()).toBeDefined();
  });
});

// Test UI module
describe('UI Module', () => {
  test('useDialog works', () => {
    const { alert } = useDialog();
    expect(alert).toBeDefined();
  });
});

// Test navigation module
describe('Navigation Module', () => {
  test('navigate changes route', () => {
    const { navigate, currentRoute } = useNavigation();
    navigate('products');
    expect(currentRoute).toBe('products');
  });
});
```

---

## 📊 Project Statistics

```
Core Module:
  - 3 files (~500 LOC)
  - Auth, Init, Config

UI Module:
  - 10 files (~1000 LOC)
  - Components, Hooks, Styles

Navigation Module:
  - 5 files (~500 LOC)
  - Router, Hooks, Deep linking

Total:
  - 18 files (~2000 LOC)
  - Clean separation of concerns
```

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24
