# Hướng Dẫn Cài Đặt và Khởi Tạo Fox eCommerce SDK

## 📦 Cài Đặt Package

### 1. Install từ Local Tarball

Nếu bạn đã build SDK locally:

```bash
npm install ./fox-ecom-0.1.0.tgz
```

**Hoặc từ đường dẫn tuyệt đối:**

```bash
npm install /Users/tuanvm37/fox-ecom/fox-ecom-0.1.0.tgz
```

### 2. Install từ npm Registry

Khi SDK được publish lên npm:

```bash
npm install fox-ecom
```

### 3. Xác Nhận Cài Đặt

```bash
npm ls fox-ecom
```

Output:
```
your-app@1.0.0 /path/to/your-app
└── fox-ecom@0.1.0
```

---

## 🚀 Khởi Tạo FoxEcomSDK

### 1. Import Component

```typescript
import { FoxEcomSDK } from 'fox-ecom';
```

### 2. Sử Dụng Cơ Bản

```typescript
import React from 'react';
import { FoxEcomSDK } from 'fox-ecom';

export function App() {
  return (
    <FoxEcomSDK
      token="your-auth-token"
      environment="production"
    />
  );
}
```

### 3. Các Props Có Sẵn

| Prop | Type | Bắt Buộc | Mô Tả |
|------|------|---------|-------|
| `token` | string | ✅ | Token xác thực người dùng |
| `environment` | 'production' \| 'staging' | ✅ | Môi trường API |
| `baseUrl` | string | ❌ | Custom API base URL |
| `timeout` | number | ❌ | Request timeout (ms), default: 10000 |
| `demoMode` | boolean | ❌ | Bypass API verification (dev only) |
| `config` | object | ❌ | Custom configuration |
| `delay` | number | ❌ | Delay before showing TabNavigator (ms) |
| `showLoader` | boolean | ❌ | Show loading indicator, default: true |

---

## 💡 Ví Dụ Sử Dụng

### Development Mode (với demoMode)

```typescript
<FoxEcomSDK
  token="demo-token"
  environment="staging"
  demoMode={true}
  delay={2000}
  showLoader={true}
/>
```

**Lợi ích:**
- Bypass API verification
- Không cần backend thực
- Nhanh chóng test UI

### Production Mode

```typescript
<FoxEcomSDK
  token={userAuthToken}
  environment="production"
  baseUrl="https://api.foxecom.com"
  timeout={15000}
  demoMode={false}
/>
```

**Lưu ý:**
- `token` phải hợp lệ
- `environment` phải match với backend
- `baseUrl` cần đúng endpoint

---

## 🎯 Luồng Khởi Tạo

```
FoxEcomSDK Component Mounted
         ↓
   Splash Screen
(Showing 2s hoặc custom delay)
         ↓
   Verify Token/Environment
   (Skip nếu demoMode=true)
         ↓
   Initialize Services
   - Routing
   - Navigation
   - Theme
   - Data Cache
         ↓
   Navigation Setup Complete
         ↓
   Auto-show TabNavigator
   (home, activity, rank, profile tabs)
         ↓
   App Ready ✨
```

---

## 🎨 Giao Diện Sau Khởi Tạo

### Màn Hình Chính (TabNavigator)

**4 Tab:**

| Tab | Label | Icon | Route |
|-----|-------|------|-------|
| 1 | Trang chủ | home | `/home` |
| 2 | Hoạt động | layers | `/activity` |
| 3 | Xếp hạng | heart | `/rank` |
| 4 | Cá nhân | custom | `/profile` |

### Màu Sắc (Design System)

- **Primary (Active):** #FF8500 (Orange)
- **Inactive:** #A0A4AF (Gray)
- **Background:** #faf9f5 (Warm White)
- **Text:** #111C36 (Dark)

---

## 🔧 Cấu Hình Nâng Cao

### Custom API Configuration

```typescript
<FoxEcomSDK
  token="your-token"
  environment="staging"
  baseUrl="https://custom-api.com"
  timeout={20000}
  config={{
    apiVersion: 'v2',
    locale: 'vi-VN',
    cacheDuration: 3600, // seconds
  }}
/>
```

### Với Custom Delay

```typescript
<FoxEcomSDK
  token="your-token"
  environment="production"
  delay={5000}  // Show splash for 5 seconds
  showLoader={true}
/>
```

### Development/Testing

```typescript
<FoxEcomSDK
  token="test-token"
  environment="staging"
  demoMode={true}
  delay={1000}
  showLoader={false}
/>
```

---

## ❌ Xử Lý Lỗi

### Token Không Hợp Lệ

```
Error: Invalid authentication token
→ Kiểm tra: token format, expiry, permissions
→ Fix: Refresh token hoặc login lại
```

### Environment Mismatch

```
Error: Environment not supported
→ Kiểm tra: environment phải là 'production' hoặc 'staging'
→ Fix: Sửa environment prop
```

### Network Error

```
Error: Failed to connect to API
→ Kiểm tra: baseUrl, network connectivity, firewall
→ Fix: Sử dụng demoMode={true} cho development
```

---

## 📱 Tích Hợp Vào Ứng Dụng

### Ví Dụ Complete (React Native)

```typescript
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FoxEcomSDK } from 'fox-ecom';
import { getAuthToken } from './services/AuthService';

export function RootNavigator() {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Lấy token từ storage hoặc authentication service
    getAuthToken().then(t => {
      setToken(t);
      setIsReady(true);
    }).catch(() => {
      // Handle login flow
      setIsReady(true);
    });
  }, []);

  if (!isReady || !token) {
    return <ActivityIndicator />;
  }

  return (
    <FoxEcomSDK
      token={token}
      environment={__DEV__ ? 'staging' : 'production'}
      demoMode={false}
      showLoader={true}
      delay={2000}
    />
  );
}

export default RootNavigator;
```

---

## 🚀 Tips & Best Practices

### ✅ Làm

- ✅ Store token securely (AsyncStorage, Keychain)
- ✅ Use demoMode for development
- ✅ Handle token refresh before expiry
- ✅ Show loading indicator during init
- ✅ Test with staging environment first

### ❌ Không Làm

- ❌ Hardcode token trong code
- ❌ Use production token trong dev
- ❌ Store token in plain text
- ❌ Skip authentication checks
- ❌ Ignore error handling

---

## 📚 Tài Liệu Thêm

- [SVG Icons Guide](./Embed_SVG_React_Native_Guide.md)
- [Project Structure](./02_structure.md)
- [Technology Stack](./03_tech.md)
- [Development Rules](./04_rule.md)

---

## 🆘 Troubleshooting

### Package không tìm được

**Problem:** `Cannot find module 'fox-ecom'`

**Solution:**
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install ./fox-ecom-0.1.0.tgz
npm install
```

### FoxEcomSDK không hiển thị

**Problem:** Blank screen sau khi mount

**Solution:**
- Kiểm tra console logs
- Verify token hợp lệ
- Check environment match backend
- Thử demoMode={true}

### Icon không hiển thị

**Problem:** Icons showing as "?"

**Solution:**
- Đảm bảo react-native-svg installed
- Check SVG_CONTENT được generate
- Verify SvgIcon component imported

---

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra logs: `console.log` output
2. Verify props: `token`, `environment`, `baseUrl`
3. Test demoMode: `demoMode={true}`
4. Rebuild package: `npm run build`
5. Reinstall: `npm install ./fox-ecom-0.1.0.tgz`

---

**Version:** 0.1.0  
**Last Updated:** 2026-07-01  
**Maintained by:** Fox eCommerce Team
