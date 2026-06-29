# Setup iOS & Android Development

Hướng dẫn setup đầy đủ để chạy Fox Eco app trên iOS simulator/device và Android emulator/device.

---

## iOS Setup

### Yêu cầu
- macOS 12.0+ (M1/M2/Intel)
- Xcode 14+ (cài từ App Store hoặc `xcode-select --install`)
- CocoaPods (sẽ cài tự động)
- Node.js 20.x (theo plan V2)

### Cách 1: Build qua Xcode (Khuyên dùng)

```bash
# 1. Mở project iOS trong Xcode
cd fox-ecom/example/ios
open FoxEcomExample.xcworkspace

# 2. Trong Xcode:
#    - Select simulator hoặc device thực từ dropdown (top left)
#    - Nhấn Play (▶) hoặc Product → Run (⌘R)
#    - App sẽ build + launch tự động

# 3. Nếu lỗi "Pod không tìm thấy":
#    - Xcode → Build Settings → search "Pod"
#    - Ensure Pods folder tồn tại trong project
#    - Nếu không, chạy `pod install` ở iOS folder
```

### Cách 2: Build qua terminal (nếu Pod install thành công)

```bash
# Fix Ruby/CocoaPods encoding issue trước
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

# 1. Install Pods (chỉ lần đầu)
cd fox-ecom/example/ios
pod install

# 2. Build từ project root
cd ../..
npm run ios
# hoặc chỉ định device:
npm run ios -- --device "iPhone 17 Pro"
```

### Debug trên iOS

**Via Xcode:**
1. Set breakpoint trong code
2. Build + run
3. App tạm dừng ở breakpoint
4. Xcode console hiển thị logs

**Via VS Code:**
```bash
# Mở .vscode/launch.json và chạy:
# F5 → chọn "Debug iOS (Simulator)" hoặc "Debug iOS (Device thật)"
```

**Hermes Debugger:**
```bash
# Khi app chạy, shake device hoặc:
# chrome://inspect → mở Hermes DevTools
```

---

## Android Setup

### Yêu cầu
- Java Development Kit (JDK) 11+
  ```bash
  java -version  # kiểm tra
  # nếu không có: brew install openjdk
  ```
- Android SDK (via Android Studio)
- Android Emulator hoặc device thực (USB debugging enabled)
- ANDROID_HOME environment variable set

### Cài Android Studio

```bash
# 1. Download từ: https://developer.android.com/studio
# 2. Cài đặt Android Studio
# 3. Launch → More → SDK Manager
# 4. Cài:
#    - Android SDK Platform 34 (API level mới)
#    - Android SDK Build Tools
#    - Android Emulator
#    - Intel HAXM hoặc Hypervisor Framework
```

### Set ANDROID_HOME

```bash
# Thêm vào ~/.zshrc (hoặc ~/.bash_profile)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Activate
source ~/.zshrc

# Verify
echo $ANDROID_HOME  # phải in path
```

### Tạo / Chạy Android Emulator

```bash
# List các emulator sẵn có
emulator -list-avds

# Tạo emulator mới (nếu chưa có)
# Cách 1 — via Android Studio UI:
#   → More → Virtual Device Manager → Create Device
#
# Cách 2 — via CLI:
sdkmanager "system-images;android-34;google_apis;arm64-v8a"
avdmanager create avd -n Fox_Eco -k "system-images;android-34;google_apis;arm64-v8a"

# Chạy emulator
emulator -avd Fox_Eco &

# Hoặc start từ Android Studio → Virtual Device Manager
```

### Build trên Android

```bash
# 1. Chắc emulator đã start (hoặc device kết nối USB)
adb devices  # kiểm tra device nhận được

# 2. Build + install + run
cd fox-ecom/example
npm run android

# 3. Nếu build thất bại:
npm install  # reinstall dependencies
cd android && ./gradlew clean  # clean build cache
cd .. && npm run android
```

### Debug trên Android

**Via Android Studio Logcat:**
```bash
# Android Studio → Logcat tab
# Filter: "fox" hoặc package name
# Xem all console logs
```

**Via Hermes Debugger:**
```bash
# Metro bundle chạy ở port 8081
# Chrome DevTools: chrome://inspect
# Chọn device, click "Inspect"
```

**Via VS Code:**
```bash
# F5 → chọn "Debug Android (Device thật)" hoặc "(Emulator)"
```

---

## Common Issues & Fixes

### iOS: "Pod không tìm thấy"
```bash
cd example/ios
rm -rf Pods Podfile.lock
export LC_ALL=en_US.UTF-8
pod install
```

### iOS: Xcode không tìm React header
- Product → Clean Build Folder (Shift+Cmd+K)
- Close Xcode
- `cd example/ios && rm -rf Pods Podfile.lock && pod install`
- Reopen `.xcworkspace` (không phải `.xcodeproj`)

### Android: "gradle wrapper not found"
```bash
cd example/android
chmod +x ./gradlew
./gradlew --version
```

### Android: Emulator quá chậm
- Dùng device thực qua USB (nhanh hơn)
- Hoặc enable Intel HAXM / Apple Hypervisor Framework
- Check: Android Studio → Virtual Device Manager → Edit → Performance

### Metro bundler port 8081 đã dùng
```bash
# Kill process cũ
lsof -i :8081 | grep node | awk '{print $2}' | xargs kill -9

# Hoặc dùng port khác
npm run ios -- --port 8082
```

---

## Quick Command Reference

### iOS
```bash
npm run ios                          # Simulator
npm run ios -- --device "iPhone 15" # Device (tên cụ thể)
npm run ios-build                   # Build release
npm run ios-release                 # Build + release

# Manual via Xcode
cd example/ios && open FoxEcomExample.xcworkspace
```

### Android
```bash
npm run android                      # Emulator/Device
npm run android-build               # Build APK
npm run android-build-apk           # Build Bundle

# Manual setup
adb devices                          # Danh sách device
emulator -avd Fox_Eco &            # Tạo emulator
```

### Common
```bash
npm run clean-all                   # Clean all (iOS + Android)
npm start                           # Metro bundler riêng
npm run lint:fix                    # Lint + format
npm test                            # Unit tests (64 tests)
```

---

## Testing Setup

### Unit tests (64 tests)
```bash
npm test -- --no-coverage
npm test -- --testPathPattern="carry"  # Run fox-eco tests only
```

### Device logs
```bash
# iOS
xcrun simctl spawn booted log stream --level debug | grep fox

# Android
adb logcat | grep fox
```

---

## Next Steps

1. **Setup iOS** → `npm run ios`
2. **Setup Android** → `npm run android`
3. **Open menu** → Tap "🦊 Fox Eco App"
4. **Test UI** → Navigate tabs, test NotificationsScreen, AddressSheet
5. **Debug** → F5 in VS Code (use launch.json configs)

---

*Last updated: 2026-06-29*
