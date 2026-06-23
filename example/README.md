# Fox eCommerce SDK - Example App

Ứng dụng test/demo cho Fox eCommerce SDK.

## 📋 Cấu trúc

```
example/
├── App.tsx              # Main app component
├── index.js             # Entry point
├── app.json             # App configuration
├── metro.config.js      # Metro bundler config
├── package.json         # Dependencies (uses SDK from ../)
└── README.md            # This file
```

## 🚀 Setup & Chạy

### 1. Cài dependencies

```bash
cd example
npm install
```

### 2. Chạy trên iOS

```bash
npm run ios
```

Hoặc chạy từ project root:
```bash
cd example && npm run ios
```

### 3. Chạy trên Android

```bash
npm run android
```

### 4. Chạy Metro bundler (nếu cần)

```bash
npm start
```

## 📦 SDK Integration

Example app install SDK từ local path:

```json
{
  "dependencies": {
    "fox-ecom": "file:../"
  }
}
```

Khi bạn cập nhật SDK code trong `../src/`, ứng dụng sẽ tự động reload.

## 🧪 Test SDK Features

Example app test:
- ✅ Components: `ProductCard`, `Cart`
- ✅ Hooks: `useCart`, `useProduct`
- ✅ Styling: `colors`, `spacing`, `typography`
- ✅ HTTP Client: `HttpClient` (optional setup)
- ✅ Dependency Injection: `setupDependencies`

## 📝 Lưu ý

- SDK chính ở `../src/`
- Example app chỉ dùng để test
- Không commit `node_modules`, `build/`, `ios/Pods/`
- Sửa code SDK → Metro tự reload app
- Xóa Derived Data nếu gặp lỗi iOS:
  ```bash
  rm -rf ~/Library/Developer/Xcode/DerivedData/*
  ```

## 🔄 Workflow

```bash
# 1. Sửa code SDK
cd ..
nano src/presentation/components/ProductCard.tsx

# 2. Save - Metro tự reload
# (App sẽ hot reload tự động)

# 3. Thấy changes ngay trong example app
```

## 🆘 Troubleshooting

### Lỗi: "Cannot find module 'fox-ecom'"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Lỗi iOS build
```bash
# Xóa Derived Data
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Xóa pods
rm -rf ios/Pods ios/Podfile.lock

# Cài lại
cd ios && pod install && cd ..
npm run ios
```

### Lỗi Metro cache
```bash
npm start -- --reset-cache
```

---

Hạnh phúc testing! 🎉
