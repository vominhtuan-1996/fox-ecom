# 📱 Fox eCommerce Example App - Setup & Build Guide

Complete guide for building and testing the example app on Android and iOS

---

## 📋 Prerequisites

### Required Software
- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- **Xcode** >= 14.0 (for iOS)
- **Android Studio** >= 2022.1 (for Android)
- **CocoaPods** >= 1.10 (for iOS dependencies)
- **Watchman** (for file watching)

### Optional Tools
- **react-native-cli**: `npm install -g react-native-cli`
- **eas-cli** (for building in cloud)

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```bash
cd /Users/tuanvm37/fox-ecom/example

# Install npm packages
npm install

# Install iOS pods (if building for iOS)
cd ios
pod install
cd ..
```

### 2️⃣ Start Metro Bundler

```bash
npm start
```

This starts the Metro bundler which watches for code changes.

### 3️⃣ Run on iOS or Android

#### iOS (in new terminal)
```bash
npm run ios
```

#### Android (in new terminal)
```bash
npm run android
```

---

## 📱 iOS Setup & Build

### Prerequisites
- macOS with Xcode 14+
- iOS 12.0 or later
- CocoaPods installed

### Installation

```bash
# 1. Install dependencies
cd example
npm install

# 2. Install iOS pods
cd ios
pod install --repo-update
cd ..

# 3. Run on simulator
npm run ios
```

### Build for Release (iOS)

```bash
# Option 1: Using npm script
npm run ios-build

# Option 2: Using Xcode CLI
cd ios
xcodebuild -workspace FoxEcomExample.xcworkspace \
  -scheme FoxEcomExample \
  -configuration Release \
  -derivedDataPath build

# Option 3: Using Xcode GUI
# 1. Open ios/FoxEcomExample.xcworkspace
# 2. Select FoxEcomExample scheme
# 3. Select Generic iOS Device or desired simulator
# 4. Product → Build for Running
# 5. Product → Archive
```

### iOS Troubleshooting

**Issue: Pod install fails**
```bash
# Solution: Clear pod cache and reinstall
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

**Issue: "Cannot find module" errors**
```bash
# Solution: Clear cache
npm start -- --reset-cache
```

**Issue: Simulator won't start**
```bash
# Solution: Kill simulator and restart
killall "com.apple.CoreSimulator.CoreSimulatorService"
xcrun simctl erase all
open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app
```

---

## 🤖 Android Setup & Build

### Prerequisites
- Android Studio with SDK
- SDK Version 33 (target)
- Min SDK Version 21
- Java Development Kit (JDK) 11+

### Installation

```bash
# 1. Install dependencies
cd example
npm install

# 2. Set ANDROID_HOME (if not set)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 3. Create Android emulator (if not exists)
$ANDROID_HOME/tools/bin/avdmanager create avd -n AndroidTestDevice -k "system-images;android-33;default;arm64-v8a"

# 4. Start emulator
$ANDROID_HOME/emulator/emulator -avd AndroidTestDevice

# 5. Run on emulator (in new terminal)
npm run android
```

### Build for Release (Android)

```bash
# Option 1: Build APK
npm run android-build

# Option 2: Build AAB (for Play Store)
npm run android-build-apk

# Option 3: Using Gradle directly
cd android
./gradlew assembleRelease
# APK will be at: android/app/build/outputs/apk/release/app-release.apk
cd ..
```

### Android Troubleshooting

**Issue: Gradle build fails**
```bash
# Solution: Clean gradle cache
cd android
./gradlew clean
cd ..
npm run android
```

**Issue: Emulator won't start**
```bash
# Solution: List and create emulator
$ANDROID_HOME/tools/bin/avdmanager list avd
$ANDROID_HOME/tools/bin/avdmanager create avd -n TestDevice -k "system-images;android-33;default;arm64-v8a"
$ANDROID_HOME/emulator/emulator -avd TestDevice
```

**Issue: "adb: command not found"**
```bash
# Solution: Add to PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools
# Or add to ~/.zshrc or ~/.bash_profile
```

---

## 🏗️ Build Procedures

### Complete Build (Both Platforms)

```bash
# 1. Clean everything
npm run clean-all

# 2. Install fresh
npm install
cd ios && pod install && cd ..

# 3. Build Android
npm run android-build

# 4. Build iOS
npm run ios-build
```

### iOS Build Output

After building, find:
- **IPA file**: `ios/build/Release-iphoneos/FoxEcomExample.app`
- **For distribution**: Archive through Xcode

### Android Build Output

After building, find:
- **APK file**: `android/app/build/outputs/apk/release/app-release.apk`
- **AAB file**: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🧪 Testing Checklist

### Functionality Tests

#### Authentication
- [ ] Login with demo credentials
- [ ] Logout successfully
- [ ] Auth state persisted after restart
- [ ] Error handling for invalid credentials

#### Products
- [ ] Products load correctly
- [ ] Product list displays all items
- [ ] Product prices shown correctly
- [ ] Ratings/stock visible

#### Shopping Cart
- [ ] Add product to cart
- [ ] View cart items
- [ ] Update quantity
- [ ] Remove items
- [ ] Clear cart
- [ ] Cart persists after restart
- [ ] Total price calculated correctly

#### Navigation
- [ ] Navigate between tabs
- [ ] Current tab highlighted
- [ ] Back button works
- [ ] Deep links work (if applicable)

### Performance Tests
- [ ] App loads quickly
- [ ] Transitions smooth
- [ ] No memory leaks
- [ ] Battery usage acceptable

### UI/UX Tests
- [ ] Responsive on different screen sizes
- [ ] Touch targets large enough
- [ ] Text readable
- [ ] Colors accessible

---

## 📦 Release Build Steps

### iOS Release Build

```bash
# 1. Increment version in app.json and package.json
{
  "version": "0.2.0"  // Increment this
}

# 2. Clean and build
npm run clean-ios
cd ios
pod install
xcodebuild -workspace FoxEcomExample.xcworkspace \
  -scheme FoxEcomExample \
  -configuration Release \
  -derivedDataPath build

# 3. Create archive
xcodebuild archive \
  -workspace ios/FoxEcomExample.xcworkspace \
  -scheme FoxEcomExample \
  -archivePath build/FoxEcomExample.xcarchive

# 4. Export IPA
xcodebuild -exportArchive \
  -archivePath build/FoxEcomExample.xcarchive \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath build/Release
```

### Android Release Build

```bash
# 1. Increment version in android/app/build.gradle
versionCode = 2
versionName = "0.2.0"

# 2. Generate keystore (first time only)
keytool -genkey -v -keystore ./android/app/my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias

# 3. Build release APK
cd android
./gradlew bundleRelease
# APK at: android/app/build/outputs/apk/release/app-release.apk
# AAB at: android/app/build/outputs/bundle/release/app-release.aab

# 4. Sign APK (if needed)
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore ./my-release-key.keystore \
  android/app/build/outputs/apk/release/app-release.apk \
  my-key-alias
```

---

## 📊 App Features Demonstrated

✅ **Authentication**
- Login/Logout
- Session management
- Demo credentials

✅ **Products**
- Product listing
- Product details
- Filtering by category
- Search functionality

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Persist cart
- Calculate totals

✅ **Navigation**
- Tab navigation
- Screen transitions
- Route management
- Deep linking support

✅ **SDK Integration**
- FoxComAuthen initialization
- Auth module usage
- Products module usage
- Cart module usage
- Navigation module usage

---

## 🎯 Environment Configuration

### Development (.env.development)
```
REACT_APP_TOKEN=dev-token
REACT_APP_ENV=development
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_ENABLE_LOGGING=true
```

### Staging (.env.staging)
```
REACT_APP_TOKEN=staging-token
REACT_APP_ENV=staging
REACT_APP_API_BASE_URL=https://staging-api.example.com
REACT_APP_ENABLE_LOGGING=true
```

### Production (.env.production)
```
REACT_APP_TOKEN=prod-token
REACT_APP_ENV=production
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_ENABLE_LOGGING=false
```

---

## 📱 Device Specifications

### Minimum Requirements
- **iOS**: 12.0+
- **Android**: 5.0+ (API 21)

### Recommended
- **iOS**: 14.0+
- **Android**: 10.0+ (API 29)

### Tested Devices
- **iOS**: iPhone 13 Pro, iPhone 15 Pro, iPad Pro
- **Android**: Pixel 4, Pixel 6, Samsung Galaxy S21

---

## 🔧 Development Tools

### Debugging

```bash
# React Native Debugger
# 1. Install: https://github.com/jhen0409/react-native-debugger
# 2. Run the app
# 3. Press Cmd+D (iOS) or Cmd+M (Android)
# 4. Select "Debug JS Remotely"

# Flipper
# 1. Install: https://fbflipper.com
# 2. Open Flipper
# 3. Run app - should auto-connect

# Console Logs
# 1. Metro Terminal
# 2. Android Studio Logcat
# 3. Xcode Console
```

### Performance Monitoring

```bash
# React Native Performance Monitor
# 1. Run app
# 2. Press Cmd+D / Cmd+M
# 3. Enable "Perf Monitor"

# Xcode Profiler (iOS)
# 1. Xcode → Product → Profile
# 2. Select Core Data, Network, etc.

# Android Studio Profiler (Android)
# 1. Android Studio → Profile
# 2. Monitor CPU, Memory, Network
```

---

## 📞 Support & Issues

### Common Issues

| Issue | Solution |
|-------|----------|
| Metro bundler won't start | `npm start -- --reset-cache` |
| Pod install fails | `rm -rf ios/Pods && pod install --repo-update` |
| Gradle fails | `cd android && ./gradlew clean` |
| Emulator won't connect | `adb devices` and `adb reconnect` |

### Getting Help

1. Check [React Native Docs](https://reactnative.dev)
2. Check [Fox eCommerce Docs](../docs/README.md)
3. Review console logs for errors
4. Use debugger to inspect state

---

## ✅ Checklist for Production

- [ ] Version bumped in package.json
- [ ] Version bumped in app.json
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance optimized
- [ ] App icon set correctly
- [ ] App name correct
- [ ] Permissions configured
- [ ] Deep links working
- [ ] Build succeeded without warnings

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24  
**Status**: Ready for Development & Testing
