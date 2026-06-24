# 🚀 SDK Simple Initialization

**Token + Environment + Extra Data**

---

## 🎯 Quick Start

### 1. Initialize SDK

```typescript
import { initSDK } from 'fox-ecom';

await initSDK({
  token: 'your-access-token',
  environment: 'production',
  extra: {
    userId: 'user-123',
    deviceId: 'device-456',
    customData: 'any-value'
  }
});
```

### 2. Use SDK

```typescript
import { getToken, getEnvironment, getAPIBaseUrl, getExtra } from 'fox-ecom';

const token = getToken();           // 'your-access-token'
const env = getEnvironment();       // 'production'
const apiUrl = getAPIBaseUrl();     // 'https://api.foxecom.com'
const userId = getExtra('userId');  // 'user-123'

// All API calls use token automatically
const response = await fetch(`${apiUrl}/products`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📝 Configuration

### Environment Variables

```bash
# .env
REACT_APP_API_BASE_URL=https://api.foxecom.com

# Optional: environment-specific URLs
REACT_APP_API_URL_DEVELOPMENT=http://localhost:3000
REACT_APP_API_URL_STAGING=https://api-staging.foxecom.com
REACT_APP_API_URL_PRODUCTION=https://api.foxecom.com
```

### API Domain Resolution

SDK uses this order:
1. `REACT_APP_API_URL_<ENV>` (if exists)
2. `REACT_APP_API_BASE_URL`
3. Default: `https://api.foxecom.com`

Example:
```typescript
// development
REACT_APP_API_URL_DEVELOPMENT=http://localhost:3000
→ http://localhost:3000

// staging
REACT_APP_API_URL_STAGING=https://api-staging.foxecom.com
→ https://api-staging.foxecom.com

// production
REACT_APP_API_URL_PRODUCTION=https://api.foxecom.com
→ https://api.foxecom.com
```

---

## 🔑 Token Management

### Initialize

```typescript
await initSDK({
  token: 'your-token-here',
  environment: 'production'
});
```

### Get Token

```typescript
const token = getToken(); // 'your-token-here'
```

### Use in Headers

```typescript
const headers = {
  'Authorization': `Bearer ${getToken()}`,
  'X-App-Version': '0.1.0'
};

const response = await fetch(url, { headers });
```

---

## 📊 Extra Data

### Set Extra Data

```typescript
import { setExtra } from 'fox-ecom';

setExtra('userId', 'user-123');
setExtra('deviceId', 'device-456');
setExtra('metadata', { os: 'iOS', version: '14.0' });
```

### Get Extra Data

```typescript
import { getExtra } from 'fox-ecom';

// Get specific field
const userId = getExtra('userId');      // 'user-123'
const metadata = getExtra('metadata');  // { os: 'iOS', ... }

// Get all extra data
const all = getExtra();  // { userId, deviceId, metadata }
```

### Use Extra in Requests

```typescript
const extra = getExtra();

const headers = {
  'Authorization': `Bearer ${getToken()}`,
  'X-User-Id': extra.userId,
  'X-Device-Id': extra.deviceId,
};
```

---

## 🌍 Environment Support

### Development

```typescript
await initSDK({
  token: 'dev-token',
  environment: 'development',
  extra: { mode: 'debug' }
});

// Uses: http://localhost:3000 (or REACT_APP_API_URL_DEVELOPMENT)
```

### Staging

```typescript
await initSDK({
  token: 'staging-token',
  environment: 'staging',
  extra: { mode: 'staging' }
});

// Uses: https://api-staging.foxecom.com
```

### Production

```typescript
await initSDK({
  token: 'prod-token',
  environment: 'production',
  extra: { mode: 'production' }
});

// Uses: https://api.foxecom.com
```

---

## 📱 React Component Example

```typescript
import { useEffect } from 'react';
import { initSDK, getToken, getAPIBaseUrl, getExtra } from 'fox-ecom';

function App() {
  useEffect(() => {
    // Initialize on mount
    initSDK({
      token: process.env.REACT_APP_AUTH_TOKEN || 'default-token',
      environment: process.env.REACT_APP_ENV as any || 'development',
      extra: {
        userId: localStorage.getItem('userId') || 'anonymous',
        appVersion: process.env.REACT_APP_VERSION
      }
    });
  }, []);

  return (
    <div>
      <p>Token: {getToken()}</p>
      <p>API: {getAPIBaseUrl()}</p>
      <p>User: {getExtra('userId')}</p>
    </div>
  );
}

export default App;
```

---

## 🔄 API Calls

### Fetch with SDK Context

```typescript
import { getToken, getAPIBaseUrl, getExtra } from 'fox-ecom';

async function getProducts() {
  const headers = {
    'Authorization': `Bearer ${getToken()}`,
    'X-User-Id': getExtra('userId'),
    'X-Request-Id': crypto.randomUUID()
  };

  const response = await fetch(
    `${getAPIBaseUrl()}/products`,
    { headers }
  );

  return response.json();
}
```

### With Axios

```typescript
import axios from 'axios';
import { getToken, getAPIBaseUrl } from 'fox-ecom';

const client = axios.create({
  baseURL: getAPIBaseUrl(),
  headers: {
    'Authorization': `Bearer ${getToken()}`
  }
});

// Use client for all API calls
export default client;
```

---

## 🛡️ Best Practices

### ✅ DO:
- Call `initSDK()` once on app startup
- Store token in secure location
- Use environment variables for URLs
- Include token in all API requests
- Use extra data for metadata
- Check `isInitialized()` before API calls

### ❌ DON'T:
- Expose token in logs
- Pass token in URL query params
- Hardcode token
- Use token without Bearer prefix
- Forget to initialize

---

## 🚀 Multi-App Setup

Each app can have different token/environment:

```typescript
// App A - Production
await initSDK({
  token: 'token_a_prod',
  environment: 'production',
  extra: { appId: 'app-a' }
});

// Later: App B - Staging (reset first)
resetSDK();
await initSDK({
  token: 'token_b_staging',
  environment: 'staging',
  extra: { appId: 'app-b' }
});
```

---

## 📋 API Reference

### `initSDK(config: SDKInitConfig): Promise<SDKInitResult>`

Initialize SDK

```typescript
interface SDKInitConfig {
  token: string;
  environment: 'development' | 'staging' | 'production';
  extra?: Record<string, any>;
}

interface SDKInitResult {
  success: boolean;
  token: string;
  environment: string;
  extra: Record<string, any>;
  apiBaseUrl: string;
  error?: string;
}
```

### `getSDK(): SDKInitResult | null`

Get full SDK state

### `getToken(): string | null`

Get current token

### `getEnvironment(): string | null`

Get current environment

### `getAPIBaseUrl(): string | null`

Get current API URL

### `getExtra(key?: string): any`

Get extra data (all or specific key)

### `setExtra(key: string, value: any): void`

Set extra data

### `isInitialized(): boolean`

Check if initialized

### `resetSDK(): void`

Reset SDK state

---

## 🆘 Troubleshooting

### "Invalid token"
```typescript
// Make sure token is a non-empty string
await initSDK({
  token: 'actual-token-string',  // ✅ Not empty
  environment: 'production'
});
```

### "Invalid environment"
```typescript
// Use one of: development, staging, production
await initSDK({
  token: 'xxx',
  environment: 'production'  // ✅ Valid
});
```

### "SDK not initialized"
```typescript
// Check if initialized first
if (isInitialized()) {
  const url = getAPIBaseUrl();
}
```

### Missing environment URL
```typescript
// Set in .env
REACT_APP_API_URL_DEVELOPMENT=http://localhost:3000
REACT_APP_API_URL_STAGING=https://api-staging.foxecom.com
REACT_APP_API_URL_PRODUCTION=https://api.foxecom.com
```

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24
