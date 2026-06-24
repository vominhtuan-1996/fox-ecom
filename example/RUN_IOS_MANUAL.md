# 📱 Manual iOS Run Guide

If automated build is taking too long, use these manual steps.

---

## 🔧 Manual Setup (Recommended)

### **Terminal 1: Start Metro Bundler**

```bash
cd /Users/tuanvm37/fox-ecom/example

# With OpenSSL fix (required for Node.js 17+)
NODE_OPTIONS=--openssl-legacy-provider npm start

# Wait for output like:
# ╔════════════════════════════════════════════════════════════╗
# ║  Welcome to Metro!                                         ║
# ║  Fast - Scalable - Integrated                              ║
# ╚════════════════════════════════════════════════════════════╝
# 
# Ready to accept connections
```

### **Terminal 2: Build & Run on iOS**

Wait until Terminal 1 shows "Ready to accept connections", then:

```bash
cd /Users/tuanvm37/fox-ecom/example

# With OpenSSL fix
NODE_OPTIONS=--openssl-legacy-provider npm run ios

# This will:
# 1. Build the iOS app
# 2. Start iOS simulator
# 3. Install app on simulator
# 4. Launch the app
```

### **Expected Output**

```
Building project with "xcodebuild".
...
Build complete!
Installing and launching your app on the simulator
App is running
```

---

## 🔍 Troubleshooting

### **Metro Shows Watchman Warning**

This is normal. Just continue - it won't prevent the app from running.

```bash
# Optional: Clear watchman if you want to remove warning
watchman watch-del '/Users/tuanvm37/fox-ecom'
watchman watch-project '/Users/tuanvm37/fox-ecom'
npm start
```

### **OpenSSL Error**

**Error**: `error:0308010C:digital envelope routines::unsupported`

**Solution**: Always use `NODE_OPTIONS=--openssl-legacy-provider` before npm commands:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
NODE_OPTIONS=--openssl-legacy-provider npm run ios
```

### **Metro Fails to Build**

If Metro shows transformer errors:

```bash
# Clear cache
npm start -- --reset-cache

# Or in separate terminal while Metro is running
# Press Ctrl+C then:
rm -rf node_modules/.cache
npm start
```

### **iOS Simulator Won't Open**

```bash
# Kill and restart simulator
killall "com.apple.CoreSimulator.CoreSimulatorService"
open -a Simulator
```

### **Xcode Build Errors**

```bash
# Clean iOS build
cd ios
rm -rf build
cd ..

# Reinstall pods
cd ios
pod install --repo-update
cd ..

# Try again
NODE_OPTIONS=--openssl-legacy-provider npm run ios
```

---

## 🔨 Using Xcode Directly

If npm scripts have issues:

```bash
cd /Users/tuanvm37/fox-ecom/example/ios

# Open in Xcode
open FoxEcomExample.xcworkspace

# Then in Xcode:
# 1. Select "FoxEcomExample" scheme (top left)
# 2. Select a simulator (iPhone 15 Pro recommended)
# 3. Press Play button or Cmd+R
```

---

## ✅ What to See

Once app launches on simulator:

1. **Blue header** with "🛍️ Fox eCommerce"
2. **Login prompt** with buttons
3. **Tab navigation** at bottom (Home, Products, Cart, Profile)
4. **Tap "Login with Demo Account"** → App shows home screen

---

## 🎯 Commands Cheat Sheet

```bash
# Full flow (2 terminals)
# Terminal 1:
NODE_OPTIONS=--openssl-legacy-provider npm start

# Terminal 2 (after "Ready" message):
NODE_OPTIONS=--openssl-legacy-provider npm run ios

# Or just one terminal:
NODE_OPTIONS=--openssl-legacy-provider npm run ios
# (slower but works)

# Clean everything
npm run clean-all
npm run clean-ios

# Check TypeScript
npm run type-check

# Lint code
npm run lint
```

---

## 📝 Notes

- **Build time**: First time ~2-5 minutes (compiles everything)
- **Subsequent runs**: ~30 seconds (Metro hot reload)
- **Simulator start**: ~10 seconds to open
- **App launch**: ~5 seconds from build complete

---

## 🚀 You're Ready!

If you see the app running on the simulator:

✅ **Login** with demo credentials (any email/password)
✅ **Browse** Products tab
✅ **Add** items to cart
✅ **View** Cart
✅ **Navigate** between tabs
✅ **Logout** and reopen to test persistence

---

**Status**: Ready to run!  
**Last Updated**: 2026-06-24
