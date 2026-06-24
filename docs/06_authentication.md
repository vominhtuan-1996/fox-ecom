# 🔐 Authentication Layer

Comprehensive authentication system for Fox eCommerce SDK

## 📋 Overview

The SDK includes a complete authentication layer with:
- Token management (access + refresh)
- Environment configuration
- Extra data support
- HTTP interceptors
- React hooks integration

---

## 🚀 Quick Start

### 1️⃣ Initialize Auth

```typescript
import { authService } from 'fox-ecom';

await authService.init({
  token: {
    accessToken: 'your-token-here',
  },
  extra: {
    deviceId: 'device-123',
    userId: 'user-456',
  },
});
```

### 2️⃣ Login

```typescript
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

if (response.success) {
  console.log('Logged in:', response.user);
}
```

### 3️⃣ Use in React

```typescript
import { useAuth } from 'fox-ecom';

function MyComponent() {
  const { session, user, login, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={() => login({ email: '', password: '' })}>Login</button>;
  }

  return <div>Hello {user?.name}</div>;
}
```

---

## 🔑 Environment Variables

Create `.env` file:

```bash
# API Configuration
REACT_APP_API_BASE_URL=https://api.foxecom.com
REACT_APP_API_TIMEOUT=10000

# Environment
REACT_APP_ENV=development
REACT_APP_ENABLE_LOGGING=true

# Version
REACT_APP_VERSION=0.1.0
```

Access in code:

```typescript
import { envConfig } from 'fox-ecom';

console.log(envConfig.get('apiBaseUrl'));
console.log(envConfig.isDevelopment());
```

---

## 👤 User Model

```typescript
interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}
```

---

## 🎫 Token Model

```typescript
interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;  // Default: 'Bearer'
}
```

---

## ⚙️ Configuration

### Init with Config

```typescript
interface AuthConfig {
  credentials: AuthCredentials;
  token: AuthToken;
  extra?: AuthExtra;
  deviceId?: string;
  userAgent?: string;
}

await authService.init({
  token: {
    accessToken: 'eyJhbGc...',
    refreshToken: 'eyJhbGc...',
    expiresIn: 3600,
    tokenType: 'Bearer',
  },
  extra: {
    deviceId: 'ios-device-123',
    appVersion: '1.0.0',
    // ... any custom data
  },
});
```

---

## 📡 API Endpoints

The auth system calls these endpoints:

### POST `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "extra": {
    "deviceId": "device-123",
    "userId": "user-123"
  }
}
```

### POST `/auth/refresh`
```json
{
  "refreshToken": "eyJhbGc..."
}
```

Response:
```json
{
  "token": {
    "accessToken": "new-eyJhbGc...",
    "expiresIn": 3600
  }
}
```

### POST `/auth/logout`
```
Authorization: Bearer {accessToken}
```

---

## 🎣 useAuth Hook

Complete React integration:

```typescript
const {
  // State
  session,           // Full session object
  user,              // Current user
  token,             // Token object
  isAuthenticated,   // Boolean
  loading,           // Loading state
  error,             // Error message

  // Methods
  login,             // (credentials) => Promise<AuthResponse>
  logout,            // () => Promise<void>
  refreshToken,      // () => Promise<boolean>
  setExtra,          // (key, value) => void
  getExtra,          // (key?) => any
  getAccessToken,    // () => string | null
} = useAuth();
```

### Example: Protected Component

```typescript
function ProtectedPage() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout} disabled={loading}>
        Logout
      </button>
    </div>
  );
}
```

---

## 🔄 Token Refresh Flow

Automatic token refresh on 401:

```typescript
// In your API layer
const response = await fetch('/api/endpoint', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

if (response.status === 401) {
  // Auth interceptor automatically:
  // 1. Calls authService.refreshToken()
  // 2. Retries the original request
  // 3. Or logs out if refresh fails
}
```

---

## 💾 Extra Data

Store custom data with auth:

```typescript
const { setExtra, getExtra } = useAuth();

// Set
setExtra('userId', 'user-123');
setExtra('deviceInfo', { os: 'iOS', version: '14.0' });

// Get
const userId = getExtra('userId');
const all = getExtra();

// In auth service
authService.setExtra('analytics', { campaign: 'promo' });
const analytics = authService.getExtra('analytics');
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Store tokens securely (localStorage for web, secure storage for RN)
- Use HTTPS only
- Implement token expiration
- Refresh tokens before they expire
- Include CSRF tokens for POST requests
- Validate tokens on the backend

### ❌ DON'T:
- Store tokens in plain text
- Pass tokens in URLs
- Expose tokens in logs
- Store sensitive data in extra
- Skip token validation

---

## 🛡️ HTTP Interceptor

Automatically added to all requests:

```
Authorization: Bearer {accessToken}
X-App-Version: 0.1.0
X-Client-Type: sdk
X-Device-Id: {extra.deviceId}
X-User-Id: {extra.userId}
```

Custom headers from extra data are automatically injected.

---

## 📊 Session Persistence

Sessions are automatically saved to localStorage:

```javascript
// Automatically saved
localStorage.getItem('fox_ecom_auth_session')    // AuthSession
localStorage.getItem('fox_ecom_auth_extra')      // Extra data

// Automatically restored on app load
// No extra code needed
```

---

## 🧪 Testing

Mock auth for tests:

```typescript
import { authService } from 'fox-ecom';

beforeEach(() => {
  authService.init({
    token: {
      accessToken: 'mock-token',
    },
    extra: {
      userId: 'test-user',
    },
  });
});

afterEach(() => {
  authService.logout();
});
```

---

## 🔗 Integration with HTTP Client

The auth system integrates with your HTTP client:

```typescript
import { HttpClient } from 'fox-ecom';
import { AuthInterceptor } from 'fox-ecom';

const http = new HttpClient();

// Interceptor is automatically applied
const response = await http.get('/api/protected');
// Token is automatically injected
```

---

## 📚 Complete Example

```typescript
import { useAuth, useDialog } from 'fox-ecom';
import { useState } from 'react';

export function LoginScreen() {
  const { login, loading, error } = useAuth();
  const { alert } = useDialog();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await login({ email, password });

    if (response.success) {
      alert({
        title: 'Success',
        message: 'Logged in!',
      });
      // Navigate to dashboard
    } else {
      alert({
        title: 'Error',
        message: response.error || 'Login failed',
      });
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

---

## 🚀 Advanced Topics

### Custom Token Payload

Parse JWT tokens:

```typescript
import { parseJwt } from 'fox-ecom';

const token = authService.getAccessToken();
const payload = parseJwt(token);

console.log(payload.exp);  // Expiration time
console.log(payload.sub);  // Subject (user ID)
```

### Multi-User Support

```typescript
// Store multiple user sessions
const users = new Map();

users.set('user1', await authService.login({...}));
users.set('user2', await authService.login({...}));

// Switch users
await authService.init(users.get('user1'));
```

### Offline Mode

```typescript
const session = authService.getSession();

if (!navigator.onLine) {
  // Use cached session
  const user = session?.user;
}
```

---

## 🐛 Troubleshooting

### "Token expired" errors
- Check token expiration time
- Implement refresh token logic
- Increase token lifetime

### "Unauthorized" on requests
- Verify token is being sent
- Check if token is corrupted
- Ensure Authorization header format

### Session not persisting
- Check localStorage is enabled
- Verify browser privacy settings
- Check for clear on exit

---

## 📖 API Reference

See `/src/common/types/auth.types.ts` for complete TypeScript definitions.

---

**Version**: 0.1.0
**Last Updated**: 2026-06-24
