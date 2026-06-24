# 🚀 Quick Start - Fox eCommerce Example App

Your example app is **READY TO RUN**! Follow these simple steps.

---

## ✅ Setup Complete

All prerequisites installed:
- ✅ npm dependencies
- ✅ iOS pods
- ✅ React Native configured
- ✅ Metro bundler ready

---

## 📱 Run on iOS (Simulator)

### Option 1: Simple Way (Recommended)

```bash
cd /Users/tuanvm37/fox-ecom/example

# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run on iOS simulator
npm run ios
```

**Expected Output:**
```
✅ Metro Bundler running on port 8081
✅ App compiled successfully
✅ iPhone simulator opens
✅ App launches
```

### Option 2: Manual Build

```bash
# Full build from scratch
cd /Users/tuanvm37/fox-ecom/example/ios
xcodebuild -workspace FoxEcomExample.xcworkspace \
  -scheme FoxEcomExample \
  -configuration Debug \
  -simulator 'iPhone 15 Pro'
```

---

## 🤖 Run on Android (Emulator)

### Prerequisites
```bash
# Set Android environment
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Or add to ~/.zshrc permanently:
# echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
# echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
# echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
# source ~/.zshrc
```

### Run App

```bash
cd /Users/tuanvm37/fox-ecom/example

# Terminal 1: Start Metro
npm start

# Terminal 2: Run on Android
npm run android
```

---

## 🏗️ Build for Release

### iOS Release Build

```bash
cd /Users/tuanvm37/fox-ecom/example

# Build
npm run ios-build

# Output: ios/build/Release-iphoneos/FoxEcomExample.app
```

### Android Release Build

```bash
cd /Users/tuanvm37/fox-ecom/example

# Build APK
npm run android-build

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Build Both Platforms

```bash
cd /Users/tuanvm37/fox-ecom/example
npm run build
```

---

## 📝 What to Test

Once app opens, test these features:

### ✅ Authentication
```
1. Tap "Login with Demo Account"
2. You should see home screen
3. Tap profile → see user info
4. Tap "Logout" → back to login
```

### ✅ Products
```
1. From home, tap "📦 Products" tab
2. See product list (Laptop, Phone, T-Shirt)
3. Each product shows: name, price, rating
4. Tap "🛒 Add to Cart"
```

### ✅ Shopping Cart
```
1. Tap "🛒 Cart" tab
2. See added items
3. Tap "+" to increase quantity
4. Tap "-" to decrease quantity
5. Tap "Remove" to delete item
6. Total price calculated correctly
```

### ✅ Navigation
```
1. Bottom tabs switch screens smoothly
2. Active tab is highlighted
3. App state persists when switching
4. No errors in console
```

### ✅ Persistence
```
1. Add items to cart
2. Close app completely
3. Reopen app
4. Cart items still there ✓
```

---

## 🐛 Troubleshooting

### Metro Won't Start
```bash
# Clear cache
npm start -- --reset-cache
```

### iOS Build Fails
```bash
# Clean and reinstall
cd /Users/tuanvm37/fox-ecom/example
rm -rf ios/Pods ios/Podfile.lock
cd ios && pod install && cd ..
npm start -- --reset-cache
npm run ios
```

### Android Build Fails
```bash
# Clean gradle
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
npm run android
```

### App Crashes on Launch
```bash
# Clear Metro cache and rebuild
npm start -- --reset-cache
# In another terminal:
npm run ios  # or npm run android
```

### "Cannot find module" Error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
cd ios && pod install && cd ..
npm start -- --reset-cache
```

---

## 🔧 Development Tips

### Hot Reload
- Change code in `src/app.tsx`
- Save file
- App reloads automatically

### Debug Mode
- Press `Cmd+D` (iOS) or `Cmd+M` (Android)
- Select "Debug JS Remotely"
- Open browser DevTools

### Console Logs
- All `console.log()` appears in Metro terminal
- Errors show in red
- Warnings show in yellow

### Inspect State
- Use React DevTools browser extension
- Connect while app is running
- Inspect auth/products/cart state

---

## 📦 Build Outputs

### After `npm run ios-build`
```
ios/build/Release-iphoneos/
└── FoxEcomExample.app
    ├── Executable
    ├── Info.plist
    └── Resources
```

### After `npm run android-build`
```
android/app/build/outputs/
├── apk/release/
│   └── app-release.apk         ← Ready to install
└── bundle/release/
    └── app-release.aab         ← For Play Store
```

---

## 📊 App Architecture

```
Example App (React Native)
    ↓
FoxComAuthen (SDK Entry Point)
    ↓
    ├── AuthService (auth module)
    ├── ProductService (products module)
    ├── CartService (cart module)
    └── Router (navigation module)
    ↓
📱 Tabs
    ├── Home
    ├── Products
    ├── Cart
    ├── Profile
    └── Login
```

---

## ✨ Features Demonstrated

✅ **Authentication**
- Demo login (no credentials needed)
- Logout
- Session persistence

✅ **Products**
- Product listing
- Product details
- Mock data (Laptop, Phone, T-Shirt)

✅ **Shopping Cart**
- Add items
- Update quantities
- Remove items
- Clear cart
- Total calculation
- Persistence

✅ **Navigation**
- Tab navigation
- Screen switching
- State preservation

✅ **SDK Integration**
- FoxComAuthen initialization
- All modules working
- Type-safe APIs

---

## 📞 Need Help?

### Check These Files
- `SETUP_AND_BUILD.md` - Complete setup guide
- `package.json` - Build scripts
- `src/app.tsx` - App source code
- `index.js` - SDK initialization

### Common Commands
```bash
# Start development
npm start
npm run ios
npm run android

# Build for release
npm run ios-build
npm run android-build

# Clean everything
npm run clean-all
npm run clean-ios
npm run clean-android

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🎯 Next Steps

1. **Run the app** (see above)
2. **Test features** (test checklist)
3. **Make changes** to `src/app.tsx`
4. **Hot reload** - changes appear instantly
5. **Build for release** when ready

---

## ✅ Status: READY!

Your example app is fully set up and ready to run! 🚀

```bash
cd /Users/tuanvm37/fox-ecom/example
npm start              # Terminal 1
npm run ios            # Terminal 2
```

**That's it! 🎉**

---

**Last Updated**: 2026-06-24  
**Status**: ✅ Ready for Development & Testing  
**Version**: 0.1.0
