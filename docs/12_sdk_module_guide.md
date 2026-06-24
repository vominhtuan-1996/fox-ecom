# 📚 SDK Module Quick Reference

Fast guide to manage SDK modules

---

## 🎯 3 Sub-Modules

```
SDK (fox-ecom)
├── @fox-ecom/core        ← Init + Auth + Config
├── @fox-ecom/ui          ← Dialogs + Components
└── @fox-ecom/navigation  ← Routing + Navigation
```

---

## 🔧 Module 1: CORE

**What it does:** Initialize SDK, manage auth, configure environment

**Files:**
```
src/modules/core/
├── init.ts                    # initSDK, getSDK
├── auth.ts                    # authService, useAuth
├── config.ts                  # envConfig
└── index.ts                   # Exports
```

**Key Exports:**
```typescript
initSDK()          // Initialize SDK
getSDK()           // Get SDK instance
authService        // Auth singleton
useAuth()          // React hook
envConfig          // Config singleton
```

**Usage:**
```typescript
import { initSDK, authService, useAuth, envConfig } from '@fox-ecom/core';

// Initialize
await initSDK({ token: 'xxx', environment: 'production' });

// Use auth
const user = authService.getUser();
const { login, logout } = useAuth();

// Use config
const apiUrl = envConfig.get('apiBaseUrl');
```

---

## 🎨 Module 2: UI

**What it does:** UI components, dialogs, toasts, buttons

**Files:**
```
src/modules/ui/
├── components/
│   ├── Dialog.tsx
│   ├── Toast.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   └── ...
├── hooks/
│   ├── useDialog.ts
│   ├── useToast.ts
│   └── ...
├── styles/
│   └── ...
└── index.ts                   # Exports
```

**Key Exports:**
```typescript
useDialog()        // Dialog hook
useToast()         // Toast hook
Dialog             // Dialog component
Toast              // Toast component
Button             // Button component
```

**Usage:**
```typescript
import { useDialog, useToast, Button } from '@fox-ecom/ui';

function MyScreen() {
  const { alert, confirm } = useDialog();
  const { show } = useToast();

  return (
    <Button onClick={() => alert({ title: 'Hello' })}>
      Show Alert
    </Button>
  );
}
```

---

## 🗺️ Module 3: NAVIGATION

**What it does:** Routing, navigation, deep linking

**Files:**
```
src/modules/navigation/
├── router.ts                  # sdkRouter service
├── useNavigation.ts           # React hook
├── deep-linking.ts            # Deep link utils
├── types.ts                   # Types
└── index.ts                   # Exports
```

**Key Exports:**
```typescript
sdkRouter          // Router singleton
useNavigation()    // React hook
handleDeepLink()   // Deep link handler
parseDeepLink()    // Parse URL
createDeepLink()   // Create URL
```

**Usage:**
```typescript
import { sdkRouter, useNavigation } from '@fox-ecom/navigation';

// Register routes
sdkRouter.registerRoutes([
  { name: 'home', path: '/home', component: HomeScreen }
]);

// Navigate
function MyComponent() {
  const { navigate, currentRoute } = useNavigation();
  
  return (
    <button onClick={() => navigate('products')}>
      Go to Products
    </button>
  );
}
```

---

## 📦 Main SDK Export

**File: `src/index.ts`**

```typescript
// Everything exported from main SDK
export * from '@/modules/core';
export * from '@/modules/ui';
export * from '@/modules/navigation';
```

---

## 🚀 Complete Init Flow

```typescript
import { 
  initSDK,          // from core
  useDialog,        // from ui
  useNavigation,    // from navigation
  sdkRouter
} from 'fox-ecom';

// 1. Initialize SDK (MUST be first)
await initSDK({
  token: 'your-token',
  environment: 'production',
  extra: { userId: 'user-123' }
});

// 2. Register routes
sdkRouter.registerRoutes([
  { name: 'home', path: '/home', component: HomeScreen },
  { name: 'products', path: '/products', component: ProductsScreen }
]);

// 3. Use in components
function App() {
  const { currentRoute, navigate } = useNavigation();
  const { alert } = useDialog();

  return (
    <div>
      {currentRoute === 'home' && <HomeScreen />}
    </div>
  );
}
```

---

## 📊 Module Dependency Tree

```
App Component
    ↓
useNavigation() ← from @fox-ecom/navigation
useDialog()     ← from @fox-ecom/ui
useAuth()       ← from @fox-ecom/core
    ↓
All modules use
authService     ← from @fox-ecom/core
envConfig       ← from @fox-ecom/core
```

---

## ✅ Module Checklist

### Core Module (CORE)
- [ ] Exports initSDK
- [ ] Exports authService
- [ ] Exports useAuth hook
- [ ] Exports envConfig
- [ ] Has index.ts with exports

### UI Module (UI)
- [ ] Exports useDialog hook
- [ ] Exports useToast hook
- [ ] Exports UI components
- [ ] Has styles
- [ ] Has index.ts with exports

### Navigation Module (NAVIGATION)
- [ ] Exports sdkRouter
- [ ] Exports useNavigation hook
- [ ] Exports deep linking functions
- [ ] Has types
- [ ] Has index.ts with exports

### Main SDK
- [ ] Exports all 3 modules
- [ ] Has package.json exports field
- [ ] Has README with examples
- [ ] Builds to dist/

---

## 🔄 Module Updates

### Add Feature to Core

```typescript
// 1. Create feature file
// src/modules/core/new-feature.ts
export function newFeature() { }

// 2. Export from module index
// src/modules/core/index.ts
export { newFeature } from './new-feature';

// 3. Available in main SDK
import { newFeature } from 'fox-ecom';
```

### Add Component to UI

```typescript
// 1. Create component
// src/modules/ui/components/NewComponent.tsx
export function NewComponent() { }

// 2. Export from components
// src/modules/ui/components/index.ts
export { NewComponent } from './NewComponent';

// 3. Export from module
// src/modules/ui/index.ts
export { NewComponent } from './components';

// 4. Available in main SDK
import { NewComponent } from 'fox-ecom/ui';
```

### Add Routing Feature

```typescript
// 1. Add to router
// src/modules/navigation/router.ts
class SDKRouter {
  newMethod() { }
}

// 2. Export from module
// src/modules/navigation/index.ts
export { sdkRouter } from './router';

// 3. Use in app
sdkRouter.newMethod();
```

---

## 🎯 Best Practice: Module Independence

Each module should be usable independently:

```typescript
// ✅ Can import core alone
import { initSDK } from '@fox-ecom/core';

// ✅ Can import ui alone
import { useDialog } from '@fox-ecom/ui';

// ✅ Can import navigation alone
import { useNavigation } from '@fox-ecom/navigation';

// ✅ Can import all together
import { initSDK, useDialog, useNavigation } from 'fox-ecom';
```

---

## 📈 Scaling: Add New Module

When you need more modules:

```
SDK
├── core           ← Stays as is
├── ui             ← Stays as is
├── navigation     ← Stays as is
├── services       ← NEW: Cart, Products, Orders
├── analytics      ← NEW: Event tracking
└── payments       ← NEW: Payment integration
```

Each new module follows same pattern:
1. Create folder: `src/modules/new-module/`
2. Create `index.ts` with exports
3. Export from main `src/index.ts`

---

## 🚀 Building & Publishing

```bash
# Build all modules
npm run build
# → dist/modules/core/
# → dist/modules/ui/
# → dist/modules/navigation/
# → dist/index.js (main SDK)

# Pack as tarball
npm pack
# → fox-ecom-0.1.0.tgz

# Publish to npm
npm publish

# Client imports
import { initSDK } from 'fox-ecom';
import { useDialog } from 'fox-ecom/ui';
import { useNavigation } from 'fox-ecom/navigation';
```

---

## 📝 File Location Quick Ref

| Feature | Location |
|---------|----------|
| Init SDK | `modules/core/init.ts` |
| Auth | `modules/core/auth.ts` |
| Config | `modules/core/config.ts` |
| Dialogs | `modules/ui/components/` |
| Components | `modules/ui/components/` |
| Hooks | `modules/ui/hooks/` |
| Router | `modules/navigation/router.ts` |
| Navigation Hook | `modules/navigation/useNavigation.ts` |
| Deep Linking | `modules/navigation/deep-linking.ts` |

---

## ✨ Key Principles

1. **One responsibility per module**
2. **Export via index.ts only**
3. **No circular imports**
4. **Core has no dependencies**
5. **UI & Navigation depend on Core**
6. **Main SDK combines all**

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24
