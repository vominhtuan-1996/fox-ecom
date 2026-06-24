# 🔐 Multi-App SDK Setup

SDK là independent service - các app khác gửi token để xác thực và config domain

## 📋 Architecture

```
Client App A → Token A + Env + Scheme → SDK
                                        ├── Validate Token A
                                        ├── Create Context A
                                        ├── Build Domain A
                                        └── Return API URL

Client App B → Token B + Env + Scheme → SDK
                                        ├── Validate Token B
                                        ├── Create Context B
                                        ├── Build Domain B
                                        └── Return API URL
```

---

## 🔑 Token Management

### Tokens được lưu trong SDK

```typescript
// App A
token: 'token_app_a_secret_123'
appId: 'app-a'
permissions: ['read', 'write']

// App B
token: 'token_app_b_secret_456'
appId: 'app-b'
permissions: ['read']
```

### Register new app token (admin)

```typescript
import { tokenValidator } from 'fox-ecom';

tokenValidator.registerToken(
  'app-c',                    // appId
  'token_app_c_secret_789',   // token
  'secret_c_new',             // secret
  ['read', 'write', 'delete'] // permissions
);
```

---

## 🚀 Client App Integration

### Option 1: HTTP Headers

```typescript
// Client App A
const response = await fetch('https://sdk.foxecom.com/api/products', {
  headers: {
    'X-SDK-Token': 'token_app_a_secret_123',
    'X-SDK-Environment': 'production',
    'X-SDK-Scheme': 'https',
  },
});
```

### Option 2: Request Body

```typescript
// Client App A
const response = await fetch('https://sdk.foxecom.com/init', {
  method: 'POST',
  body: JSON.stringify({
    token: 'token_app_a_secret_123',
    environment: 'production',
    scheme: 'https',
    domain: 'custom.domain.com', // optional
    extra: {
      userId: 'user-123',
      metadata: { ... }
    }
  }),
});

const { context } = await response.json();
// Use context.apiBaseUrl for all API calls
```

### Option 3: SDK Package (if distributed as npm)

```typescript
import { initializeSDK } from 'fox-ecom';

const response = await initializeSDK({
  token: 'token_app_a_secret_123',
  environment: 'production',
  scheme: 'https',
});

if (response.success) {
  const apiUrl = response.context.apiBaseUrl;
  // Use apiUrl for all API calls
}
```

---

## 🏗️ Express Server Example

### Setup middleware

```typescript
import express from 'express';
import { createSDKMiddleware } from 'fox-ecom';

const app = express();

// Apply SDK middleware
app.use(createSDKMiddleware());

// Protected routes
app.get('/products', (req, res) => {
  const context = req.sdkContext;
  const appId = req.appId;
  
  console.log(`Request from app: ${appId}`);
  console.log(`API URL: ${context.apiBaseUrl}`);
  
  // Handle request
  res.json({ appId, apiUrl: context.apiBaseUrl });
});
```

### Init endpoint

```typescript
app.post('/init-sdk', async (req, res) => {
  const { token, environment, scheme, domain, extra } = req.body;
  
  const response = await initializeSDK({
    token,
    environment,
    scheme,
    domain,
    extra,
  });
  
  res.json(response);
});
```

---

## 🌍 Domain Building

### Default Domain Pattern

```
Development:  http://api-development.foxecom.com
Staging:      https://api-staging.foxecom.com
Production:   https://api.foxecom.com
```

### Custom Domain

```typescript
await initializeSDK({
  token: 'token_xxx',
  environment: 'production',
  scheme: 'https',
  domain: 'custom-api.myapp.com', // Custom domain
});

// Result: https://custom-api.myapp.com
```

### Scheme Support

```typescript
// HTTP (development)
{
  scheme: 'http',
  // Result: http://api-development.foxecom.com
}

// HTTPS (production)
{
  scheme: 'https',
  // Result: https://api.foxecom.com
}
```

---

## 🎯 App Context

### Context Structure

```typescript
interface AppContext {
  appId: string;              // 'app-a'
  token: string;              // 'token_app_a_...'
  environment: string;        // 'production'
  scheme: string;             // 'https'
  apiDomain: string;          // 'https://api.foxecom.com'
  apiBaseUrl: string;         // Full URL
  extra: Record<string, any>; // Custom data
  isValid: boolean;           // true
  createdAt: number;          // timestamp
  expiresAt?: number;         // optional expiry
}
```

### Access Context

```typescript
import { getSDKContext } from 'fox-ecom';

// Express middleware
app.get('/endpoint', (req, res) => {
  const context = getSDKContext(req);
  
  console.log(context.appId);
  console.log(context.apiBaseUrl);
  console.log(context.extra);
});
```

---

## 🔄 Flow Example

### Client App A (Production)

```typescript
// 1. Send init request
const response = await fetch('https://sdk.foxecom.com/init', {
  method: 'POST',
  body: JSON.stringify({
    token: 'token_app_a_secret_123',
    environment: 'production',
    scheme: 'https',
    extra: { userId: 'user-123' }
  }),
});

// 2. Get context
const { success, context } = await response.json();
// {
//   success: true,
//   context: {
//     appId: 'app-a',
//     apiBaseUrl: 'https://api.foxecom.com',
//     environment: 'production'
//   }
// }

// 3. Use context for API calls
const productsResponse = await fetch(
  `${context.apiBaseUrl}/products`,
  {
    headers: {
      'X-App-Id': context.appId,
      'X-User-Id': context.extra.userId
    }
  }
);
```

### Client App B (Staging)

```typescript
// Same flow but different token
const response = await fetch('https://sdk.foxecom.com/init', {
  method: 'POST',
  body: JSON.stringify({
    token: 'token_app_b_secret_456',    // Different token
    environment: 'staging',              // Different env
    scheme: 'https',
  }),
});

// Result:
// {
//   appId: 'app-b',
//   apiBaseUrl: 'https://api-staging.foxecom.com'
// }
```

---

## 🛡️ Security Features

### Per-App Isolation

```typescript
// App A có context riêng
// App B có context riêng
// Không thể xem context của nhau
```

### Token Validation

```typescript
✅ Token exists
✅ Token is active
✅ Token not expired
✅ Permission check
```

### Permission Checks

```typescript
// App A: ['read', 'write']
// App B: ['read']

// Không thể gọi write API từ App B
```

---

## 📊 Multi-App Example

### Setup 3 apps

```typescript
import { tokenValidator } from 'fox-ecom';

// Register App A (full access)
tokenValidator.registerToken(
  'app-a',
  'token_app_a_xyz',
  'secret_a',
  ['read', 'write', 'delete']
);

// Register App B (read-only)
tokenValidator.registerToken(
  'app-b',
  'token_app_b_abc',
  'secret_b',
  ['read']
);

// Register App C (staging)
tokenValidator.registerToken(
  'app-c',
  'token_app_c_def',
  'secret_c',
  ['read', 'write']
);
```

### Each app gets unique context

```typescript
// App A: Production, Full Access
// ├── Token: token_app_a_xyz
// ├── Environment: production
// ├── Domain: https://api.foxecom.com
// └── Permissions: read, write, delete

// App B: Production, Read-Only
// ├── Token: token_app_b_abc
// ├── Environment: production
// ├── Domain: https://api.foxecom.com
// └── Permissions: read

// App C: Staging, Read-Write
// ├── Token: token_app_c_def
// ├── Environment: staging
// ├── Domain: https://api-staging.foxecom.com
// └── Permissions: read, write
```

---

## 🔐 Admin Operations

### List all active tokens

```typescript
const tokens = tokenValidator.listActiveTokens();
tokens.forEach(t => {
  console.log(`${t.appId}: ${t.permissions}`);
});
```

### Revoke token

```typescript
const revoked = tokenValidator.revokeToken('token_app_a_xyz');
// App A cannot use SDK anymore
```

### Validate with permission

```typescript
const result = tokenValidator.validateWithPermission(
  'token_app_b_abc',
  'write'
);
// { valid: false, error: 'PERMISSION_DENIED' }
```

---

## 📡 REST API

### POST /init

Initialize SDK for an app

**Request:**
```json
{
  "token": "token_app_a_xyz",
  "environment": "production",
  "scheme": "https",
  "domain": "custom.domain.com",
  "extra": {
    "userId": "user-123"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "context": {
    "appId": "app-a",
    "apiBaseUrl": "https://api.foxecom.com",
    "environment": "production",
    "extra": { "userId": "user-123" }
  },
  "message": "SDK initialized for app-a"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Token not found"
}
```

### POST /api/*

Any API endpoint can use middleware

**Headers:**
```
X-SDK-Token: token_app_a_xyz
X-SDK-Environment: production
X-SDK-Scheme: https
```

---

## 🎯 Best Practices

### ✅ DO:
- Validate token on every request
- Use HTTPS for production
- Store tokens securely (env variables)
- Check permissions before operations
- Log all SDK operations
- Rotate tokens periodically

### ❌ DON'T:
- Expose token in URL
- Log tokens in plaintext
- Hardcode tokens
- Share tokens between apps
- Skip validation
- Use HTTP in production

---

## 🆘 Troubleshooting

### "Token not found"
```typescript
// Make sure token is registered
tokenValidator.registerToken('app-x', 'token_xxx', 'secret', ['read']);
```

### "Permission denied"
```typescript
// Add required permission
// Check what permissions the app has
const tokens = tokenValidator.listActiveTokens();
```

### "Invalid environment"
```typescript
// Use valid environment: development, staging, production
// Check scheme: http or https
```

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24
