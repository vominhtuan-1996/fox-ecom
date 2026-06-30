# 03 - Technology Stack & Setup

Complete technology stack, dependencies, and development environment setup.

---

## Môi trường thực tế đang chạy

| Công cụ | Version thực tế | Ghi chú |
|---------|-----------------|---------|
| **Node.js** | 20.x (LTS) | Runtime |
| **npm** | 11.12.1 | Package manager |
| **React Native** | 0.77.3 | Framework (target production version) |
| **React** | 18.3.1 | UI library (target production version) |
| **Metro** | 0.66.2 | Bundler |
| **Nguồn (Source)** | TypeScript (.ts, .tsx) | Viết code bằng TypeScript |
| **Compiled Output** | JavaScript ES6+ | Biên dịch bằng tsc → dist/ (chỉ .js files) |
| **Runtime** | JavaScript ES6+ | Chạy JavaScript thuần — **không TypeScript** |
| **Babel** | 7.29.7 | Transpiler |
| **Xcode** | 26.x | iOS build tool |
| **CocoaPods** | 1.16.2 | iOS dependency manager |

---

## Technology Stack

### Core (SDK — `fox-ecom/`)

| Library | Version | Purpose |
|---------|---------|---------|
| **React** | 18.3.1 (peer >=18.3.1) | UI library |
| **React Native** | 0.77.3 (peer >=0.77.3) | Mobile framework |
| **TypeScript** | ^5.0.0 | Compile-time (dev-only, removed from build output) |
| **react-native-svg** | ^15.15.5 | SVG rendering |
| **react-native-reanimated** | ^4.5.0 | Animations |
| **react-native-gesture-handler** | ^3.0.2 | Gesture system |
| **@gorhom/bottom-sheet** | ^5.2.14 | Bottom sheet UI |
| **@react-native-async-storage/async-storage** | ^3.1.1 | Local storage |
| **@react-native-community/datetimepicker** | ^9.1.0 | Date/time picker |
| **@react-native-community/slider** | ^5.2.0 | Slider component |

### Example App (`example/`)

| Library | Version thực tế | Purpose |
|---------|-----------------|---------|
| **React Native** | 0.65.3 | Framework |
| **React** | 17.0.2 | UI library |
| **Metro** | 0.66.2 | Bundler |
| **@react-native-async-storage/async-storage** | 1.17.11 | Local storage |
| **react-native-svg** | 15.15.5 | SVG rendering |
| **react-native-svg-transformer** | 1.5.3 | `.svg` → React component |
| **hermes-engine** | ^0.11.0 | JS engine trên iOS/Android |

### Build & Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| **Babel** | 7.29.7 | Transpiler |
| **Metro** | bundled với RN 0.77 | React Native bundler |
| **react-native-svg-transformer** | 1.5.3 | Chuyển `.svg` thành React component |

### Testing (SDK)

| Tool | Version | Purpose |
|------|---------|---------|
| **Jest** | ^29.7.0 | Test framework |
| **@testing-library/react-native** | ^12.9.0 | Component testing |
| **babel-jest** | ^29.7.0 | Transform JS trong Jest |

### Linting & Formatting (SDK)

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | ^8.40.0 | Code linting |
| **Prettier** | 2.8.8 | Code formatting |
| **eslint-plugin-react** | ^7.32.0 | React rules |
| **eslint-plugin-react-native** | ^4.0.0 | RN-specific rules |

---

## Debug trên thiết bị thật

### VS Code Extensions (bắt buộc cài)

| Extension | ID | Mục đích |
|---|---|---|
| **React Native Tools** | `msjsdiag.vscode-react-native` | Debug JS trực tiếp trên device/emulator qua VS Code |
| **Hermes Debugger** | tích hợp sẵn trong React Native Tools | Debug Hermes engine (RN 0.77 mặc định dùng Hermes) |
| **ESLint** | `dbaeumer.vscode-eslint` | Lint realtime trong editor |
| **Prettier** | `esbenp.prettier-vscode` | Format on save |

### Cài React Native Tools

```bash
# Cài extension trong VS Code
code --install-extension msjsdiag.vscode-react-native
```

Tạo file `.vscode/launch.json` ở root project:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug iOS (Device)",
      "type": "reactnative",
      "request": "launch",
      "platform": "ios",
      "target": "device"
    },
    {
      "name": "Debug iOS (Simulator)",
      "type": "reactnative",
      "request": "launch",
      "platform": "ios",
      "target": "simulator"
    },
    {
      "name": "Debug Android (Device)",
      "type": "reactnative",
      "request": "launch",
      "platform": "android",
      "target": "device"
    },
    {
      "name": "Attach to Hermes (iOS)",
      "type": "reactnativedirect",
      "request": "attach",
      "platform": "ios"
    },
    {
      "name": "Attach to Hermes (Android)",
      "type": "reactnativedirect",
      "request": "attach",
      "platform": "android"
    }
  ]
}
```

### Debug trên iOS thật

```bash
# 1. Kết nối iPhone qua USB, trust computer
# 2. Mở Xcode → chọn device thật ở dropdown
# 3. Build & run
cd example/ios && xed .          # mở Xcode
# hoặc:
npx react-native run-ios --device "Tên iPhone"

# 4. Trong VS Code: F5 → chọn "Debug iOS (Device)"
# 5. Trên device: shake điện thoại → "Open Debugger" hoặc Dev Menu
```

### Debug trên Android thật

```bash
# 1. Bật Developer Mode + USB Debugging trên thiết bị
# 2. Kết nối USB
adb devices                      # kiểm tra device đã nhận chưa
adb reverse tcp:8081 tcp:8081   # forward Metro port

# 3. Build & run
npx react-native run-android

# 4. Trong VS Code: F5 → chọn "Debug Android (Device)"
```

### Hermes Debugger (RN 0.77 — khuyên dùng)

RN 0.77 dùng Hermes engine mặc định — debug qua Chrome DevTools Protocol:

```bash
# Khi app đang chạy trên device, mở Chrome:
# chrome://inspect → "Open dedicated DevTools for Node"
# Hoặc: shake device → "Open Debugger"
```

VS Code attach trực tiếp:
- `F5` → **"Attach to Hermes (iOS)"** hoặc **"Attach to Hermes (Android)"**
- Set breakpoint trong file `.js` → debug như web thông thường

### Reactotron (network + state inspector)

```bash
# Cài Reactotron desktop app: https://github.com/infinitered/reactotron
# Cài package trong project:
npm install --save-dev reactotron-react-native

# Tạo file ReactotronConfig.js ở root example/:
```

```js
// example/ReactotronConfig.js
import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({ host: '192.168.x.x' })  // IP máy tính khi dùng device thật
  .useReactNative()
  .connect();
```

```js
// Import ở đầu example/index.js (chỉ trong __DEV__)
if (__DEV__) {
  require('./ReactotronConfig');
}
```

**Tính năng Reactotron:**
- Xem toàn bộ network request/response
- Log state theo thời gian thực
- Benchmark performance
- Custom commands từ desktop app

### Lưu ý khi debug device thật

| Tình huống | Giải pháp |
|---|---|
| Metro không kết nối được | `adb reverse tcp:8081 tcp:8081` (Android) hoặc cùng WiFi (iOS) |
| App crash không có log | Xem log qua `npx react-native log-ios` hoặc `log-android` |
| Hermes không attach được | Đảm bảo `__DEV__ === true`, rebuild app |
| iOS không trust computer | Settings → General → VPN & Device Management → Trust |

---

## API Endpoints

### PMS (Product Management System)

| Environment | Base URL |
|-------------|----------|
| **Development** | `https://apis-dev.fpt.vn` |
| **Staging** | `https://apis-stag.fpt.vn` |
| **Production** | `https://apis.fpt.vn` |

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `pms/api/m/v1/users/loginInternal` | POST | Login nội bộ (username) |
| `pms/api/m/v1/users/login` | POST | Login bằng token |
| `pms/api/m/v1/users/menu` | GET | Lấy danh sách menu |

Environment được set trong `example/index.js`:
```js
const ENV = 'staging'; // 'development' | 'staging' | 'production'
```

---

## Project Setup

### Prerequisites

```bash
node --version   # v20.x (LTS)
npm --version    # 11.12.1
# iOS: Xcode 26+, CocoaPods 1.16.2
```

### Cài đặt

```bash
# SDK
cd fox-ecom && npm install

# Example app
cd fox-ecom/example && npm install
cd ios && LANG=en_US.UTF-8 pod install
```

### Verify

```bash
npm run type-check
npm run lint
npm test
```

---

## NPM Scripts

### SDK (`fox-ecom/`)

```bash
npm run type-check          # Kiểm tra TypeScript
npm run lint                # ESLint
npm run lint:fix            # Auto-fix lint
npm test                    # Jest
npm test -- --coverage      # Với coverage report
npm run build               # Compile + pack tgz
npm run clean               # Xóa dist/ và tgz
```

### Example App (`example/`)

```bash
npm run start               # Khởi động Metro (NODE_OPTIONS=--openssl-legacy-provider)
npm run ios                 # Chạy iPhone 17 Pro simulator
npm run android             # Chạy Android emulator
```

> ⚠️ Luôn dùng `NODE_OPTIONS=--openssl-legacy-provider` khi chạy Metro do Node 25 dùng OpenSSL 3.

---

## Configuration Files

### `metro.config.js` (example app — thực tế)

```js
module.exports = {
  projectRoot,
  watchFolders: [sdkRoot],           // Watch toàn bộ SDK src
  resolver: {
    platforms: ['ios', 'android'],
    sourceExts: ['svg', 'ts', 'tsx', 'js', 'jsx', 'json'],  // svg phải đứng trước
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ttf', 'otf', 'mp4'],
    extraNodeModules: {
      'fox-ecom': path.resolve(sdkRoot, 'src'),
      'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
      'react': path.resolve(projectRoot, 'node_modules/react'),
      'react-native-svg': path.resolve(projectRoot, 'node_modules/react-native-svg'),
      '@react-native-async-storage/async-storage': '...',
    },
    blacklistRE: /* block sdk/node_modules/react-native & react */,
  },
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
};
```

**Lý do cấu hình phức tạp**:
- Metro 0.66 không hỗ trợ `resolveRequest` cho relative imports → phải dùng `blacklistRE` + `extraNodeModules`
- `watchFolders: [sdkRoot]` khiến Metro scan cả `fox-ecom/node_modules` → cần blacklist `react` và `react-native` của SDK để tránh duplicate
- `inline-plugin.js` cần được patch: thêm guard `opts.platform != null` tránh crash khi pre-scan không có platform context

### `tsconfig.json` (SDK)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "jsx": "react-native",
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

> ⚠️ `@/` alias chỉ hoạt động trong TypeScript. Metro không tự resolve alias này — phải dùng relative path trong runtime code hoặc cấu hình thêm `extraNodeModules`.

### `babel.config.js` (example app)

```js
module.exports = { presets: ['module:metro-react-native-babel-preset'] };
```

> Không dùng `babel-plugin-module-resolver` — plugin này can thiệp vào Flow `import typeof` stripping, làm Metro crash khi scan `react-native/index.js`.

### SVG Setup

`.svg` files trong `src/assets/icons/` được transform bởi `react-native-svg-transformer`:

```ts
// Import trực tiếp như React component
import HomeIcon from './home.svg';
<HomeIcon width={24} height={24} color="#1976d2" />
```

Type declaration tại `src/types/svg.d.ts`.

---

## Build Process

```
src/ (TypeScript)
    ↓ Babel + metro-react-native-babel-preset
    ↓ react-native-svg-transformer (cho .svg)
    ↓ Metro 0.66.2
    ↓
dist/ (JavaScript + .d.ts)
    ↓ npm pack
fox-ecom-0.1.0.tgz
```

---

## iOS Native Setup

| Thành phần | Version | Ghi chú |
|------------|---------|---------|
| **Xcode** | 26.x | Build tool |
| **CocoaPods** | 1.16.2 | Dependency manager |
| **iOS Deployment Target** | 13.4 | Minimum iOS version |
| **RNSVG (CocoaPods pod)** | 15.15.5 | Native SVG renderer |
| **RNCAsyncStorage** | 1.17.11 | Native AsyncStorage |
| **Hermes** | ^0.11.0 | JS engine |

Pod install:
```bash
LANG=en_US.UTF-8 pod install --project-directory=example/ios
```

> ⚠️ Cần `LANG=en_US.UTF-8` vì CocoaPods 1.16.2 fail trên terminal không UTF-8.

---

## Known Issues & Workarounds

| Issue | Workaround |
|-------|-----------|
| Node 25 + OpenSSL 3 | Thêm `NODE_OPTIONS=--openssl-legacy-provider` |
| Metro 0.66 pre-scan với `platform=null` | Patch `metro-transform-plugins/src/inline-plugin.js`: guard `opts.platform != null` |
| SDK `react-native` duplicate với example | `blacklistRE` block `fox-ecom/node_modules/react-native` và `react` |
| CocoaPods UTF-8 | Chạy với `LANG=en_US.UTF-8` |
| Xcode 26 + FBReactNativeSpec codegen | Skip build phase trong `post_install` của Podfile |

---

## Troubleshooting

```bash
# Reset Metro cache
npm start -- --reset-cache

# Watchman reset (nếu có recrawl warnings)
watchman watch-del '/path/to/fox-ecom'
watchman watch-project '/path/to/fox-ecom'

# Xóa iOS build
cd example/ios && rm -rf build Pods Podfile.lock
LANG=en_US.UTF-8 pod install

# Full clean
cd example && rm -rf node_modules && npm install
```

| Triệu chứng | Nguyên nhân | Fix |
|-------------|-------------|-----|
| White screen | Metro bundle fail silently | Check Metro log, `--reset-cache` |
| `dispatcher.useState` null | Hai bản React load song song | Kiểm tra `blacklistRE` trong metro.config.js |
| Metro hang khi build bundle | `inline-plugin` crash với `platform=null` | Đã patch — xem Known Issues |
| SVG icon không hiển thị | `react-native-svg` chưa được link | `pod install`, thêm vào `extraNodeModules` |
| `@/` import không resolve | Metro không hỗ trợ alias native | Dùng relative path trong runtime code |
