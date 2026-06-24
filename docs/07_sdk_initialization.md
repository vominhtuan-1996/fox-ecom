# 🚀 SDK Initialization & Authentication

Complete guide for initializing Fox eCommerce SDK with authentication

## 📋 Overview

The SDK uses a **factory pattern** for initialization:

1. **Call `initSDK()`** with authentication config
2. **Get authenticated SDK instance**
3. **Use SDK** with automatic auth headers
4. **All API calls** use authenticated context

---

## 🔑 Quick Start

### Step 1: Initialize SDK

```typescript
import { initSDK } from 'fox-ecom';

const sdk = await initSDK({
  apiBaseUrl: 'https://api.foxecom.com',
  token: 'your-access-token',
  environment: 'production',
});
```

### Step 2: Check Status

```typescript
if (sdk.isAuthenticated()) {
  console.log('✅ SDK ready to use');
  console.log('User ID:', sdk.getExtra('userId'));
} else {
  console.error('❌ Not authenticated');
}
```

### Step 3: Use SDK Features

```typescript
// Dialog component
const { alert, confirm } = useDialog();

// Cart operations
const { addToCart } = useCart();

// All calls automatically include auth token
```

---

## 📖 Complete Examples

### Example 1: Basic Initialization

```typescript
import { initSDK } from 'fox-ecom';

async function setup() {
  try {
    const sdk = await initSDK({
      apiBaseUrl: 'https://api.foxecom.com',
      apiTimeout: 10000,
      token: 'eyJhbGciOiJIUzI1NiIs...',
      environment: 'production',
    });

    console.log('SDK initialized:', sdk.getVersion());
  } catch (error) {
    console.error('Initialization failed:', error.message);
  }
}

setup();
```

### Example 2: With Extra Data

```typescript
const sdk = await initSDK({
  apiBaseUrl: 'https://api.foxecom.com',
  token: 'your-token',
  extra: {
    deviceId: 'ios-device-123',
    userId: 'user-456',
    appVersion: '1.0.0',
    customField: 'custom-value',
  },
});

// Access extra data
console.log(sdk.getExtra('userId'));        // 'user-456'
console.log(sdk.getExtra());                 // All extra data
```

### Example 3: Refresh Token

```typescript
const sdk = await initSDK({
  apiBaseUrl: 'https://api.foxecom.com',
  token: {
    accessToken: 'current-token',
    refreshToken: 'refresh-token',
    expiresIn: 3600,
    tokenType: 'Bearer',
  },
});

// Later, when token expires
const refreshed = await sdk.refreshAuth();
if (refreshed) {
  console.log('✅ Token refreshed');
} else {
  console.log('❌ Refresh failed, login required');
}
```

### Example 4: With React

```typescript
import { initSDK, getSDK } from 'fox-ecom';
import { useEffect, useState } from 'react';

function App() {
  const [sdk, setSdk] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const initialized = await initSDK({
          apiBaseUrl: process.env.REACT_APP_API_URL,
          token: localStorage.getItem('authToken') || '',
          extra: {
            userId: localStorage.getItem('userId'),
          },
        });
        setSdk(initialized);
      } catch (err) {
        setError(err.message);
      }
    };

    initializeSDK();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!sdk) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to Fox eCommerce</h1>
      <p>Environment: {sdk.getEnvironment()}</p>
      <p>Authenticated: {sdk.isAuthenticated() ? '✅' : '❌'}</p>
    </div>
  );
}

export default App;
```

---

## 🔧 API Reference

### `initSDK(options: SDKInitOptions): Promise<SDKInstance>`

Initialize the SDK with authentication.

**Parameters:**
```typescript
interface SDKInitOptions {
  apiBaseUrl: string;           // Required: API endpoint
  apiTimeout?: number;          // Optional: Request timeout (ms)
  environment?: string;         // Optional: dev|staging|production
  token: string | AuthToken;    // Required: Access token
  extra?: AuthExtra;            // Optional: Custom data
  deviceId?: string;            // Optional: Device ID
  userId?: string;              // Optional: User ID
}
```

**Returns:**
```typescript
interface SDKInstance {
  isInitialized(): boolean;
  isAuthenticated(): boolean;
  getConfig(): SDKConfig | null;
  getState(): SDKState;
  getToken(): string | null;
  getAccessToken(): string | null;
  setExtra(key: string, value: any): void;
  getExtra(key?: string): any;
  refreshAuth(): Promise<boolean>;
  logout(): Promise<void>;
  getVersion(): string;
  getEnvironment(): string;
}
```

**Throws:**
```typescript
// Throws Error if:
// - apiBaseUrl missing
// - token missing
// - token.accessToken missing
```

---

### `getSDK(): SDKInstance`

Get current SDK instance (after initialization).

```typescript
try {
  const sdk = getSDK();
  console.log(sdk.isAuthenticated());
} catch (error) {
  console.log('SDK not initialized');
}
```

---

### `resetSDK(): void`

Reset and destroy SDK instance.

```typescript
resetSDK();
// SDK must be reinitialized before using again
```

---

## 🎫 Token Formats

### String Token

```typescript
await initSDK({
  apiBaseUrl: '...',
  token: 'eyJhbGciOiJIUzI1NiIs...',
});
```

### Token Object

```typescript
await initSDK({
  apiBaseUrl: '...',
  token: {
    accessToken: 'eyJhbGciOiJIUzI1NiIs...',
    refreshToken: 'eyJyZWZyZXNoIjoi...',
    expiresIn: 3600,
    tokenType: 'Bearer',
  },
});
```

---

## 🛡️ Security Features

✅ **Automatic Auth Injection**
- All API requests include Authorization header
- Format: `Authorization: Bearer {token}`

✅ **Token Refresh**
- Automatic 401 handling
- Refresh token if available
- Logout if refresh fails

✅ **Session Persistence**
- Session stored in localStorage
- Restored on app reload
- Survives page refresh

✅ **Extra Data**
- Store custom fields with auth
- Accessible via `sdk.getExtra()`
- Automatically persisted

---

## 🔄 State Management

### Check SDK State

```typescript
const state = sdk.getState();
console.log(state);
// {
//   isInitialized: true,
//   isAuthenticated: true,
//   config: { ... },
//   error: null
// }
```

### Monitor Changes

```typescript
// Subscribe to auth changes
import { authService } from 'fox-ecom';

const unsubscribe = authService.subscribe((session) => {
  if (!session) {
    console.log('User logged out');
  }
});

// Cleanup
unsubscribe();
```

---

## 📱 Environment Configuration

### Development

```typescript
await initSDK({
  apiBaseUrl: 'http://localhost:3000',
  environment: 'development',
  token: 'dev-token',
});
```

### Staging

```typescript
await initSDK({
  apiBaseUrl: 'https://staging-api.foxecom.com',
  environment: 'staging',
  token: process.env.STAGING_TOKEN,
});
```

### Production

```typescript
await initSDK({
  apiBaseUrl: 'https://api.foxecom.com',
  environment: 'production',
  token: process.env.PROD_TOKEN,
});
```

---

## 🚨 Error Handling

### Initialization Error

```typescript
try {
  await initSDK({ /* ... */ });
} catch (error) {
  // SDK initialization failed
  console.error('Init failed:', error.message);
}
```

### Not Initialized

```typescript
try {
  const sdk = getSDK();
} catch (error) {
  // SDK was never initialized
  console.error('SDK not initialized');
}
```

### Not Authenticated

```typescript
const sdk = await initSDK({ /* ... */ });

if (!sdk.isAuthenticated()) {
  // Token is invalid or expired
  // Try refresh or login again
}
```

---

## 🔄 Logout & Cleanup

### Logout

```typescript
const sdk = getSDK();
await sdk.logout();
// Session cleared
// SDK state reset
```

### Reset SDK

```typescript
resetSDK();
// Complete cleanup
// Must reinitialize to use again
```

---

## 📊 Integration with Features

### Dialogs

```typescript
import { useDialog } from 'fox-ecom';

// DialogProvider wraps your app
function App() {
  const { alert, confirm } = useDialog();

  // Use dialogs (works with authenticated SDK)
  return (
    <button onClick={() => alert({ title: 'Hello' })}>
      Show Alert
    </button>
  );
}
```

### Cart

```typescript
import { useCart } from 'fox-ecom';

function ShoppingCart() {
  const { addToCart, items } = useCart();

  // All cart operations use auth token automatically
  return (
    <div>
      {items.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## 🎯 Best Practices

### ✅ DO:
- Initialize SDK on app startup
- Store token securely
- Refresh token before expiry
- Check `isAuthenticated()` before operations
- Handle initialization errors
- Reset on logout

### ❌ DON'T:
- Pass token in URLs
- Log tokens
- Store in plain text
- Initialize multiple times
- Forget to handle errors
- Expose token in UI

---

## 🆘 Troubleshooting

### "SDK not initialized" Error

```typescript
// ❌ Wrong
const sdk = getSDK();  // Throws if not initialized

// ✅ Right
try {
  const sdk = getSDK();
} catch (error) {
  // Initialize first
  await initSDK({ /* ... */ });
}
```

### "Token is required" Error

```typescript
// ✅ Provide token
await initSDK({
  apiBaseUrl: '...',
  token: 'your-token-here',  // Required!
});
```

### "Not authenticated" Status

```typescript
// Check and refresh
if (!sdk.isAuthenticated()) {
  const refreshed = await sdk.refreshAuth();
  if (!refreshed) {
    // Need to login again
  }
}
```

---

## 📚 Related Documentation

- [Authentication Layer](./06_authentication.md)
- [HTTP Client](./03_tech.md#http-client)
- [Environment Config](../src/common/config/env.config.ts)

---

**Version**: 0.1.0
**Last Updated**: 2026-06-24
