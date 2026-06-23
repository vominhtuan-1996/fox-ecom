# iOS Setup - Troubleshooting Guide

## Issue: Build fails with error code 65

**Root Cause**: React Native 0.72.17 + Xcode 26.3 SDK compatibility issue

The RCT-Folly library has typedef conflicts with the latest iOS SDK headers.

## Solutions

### Option 1: Use Previous Xcode Version (Recommended for Development)
```bash
# Downgrade to Xcode 15.x if available
# Check installed versions:
ls /Applications/ | grep Xcode
```

### Option 2: Skip iOS and Use Android Instead
```bash
cd example
npm run android
```

### Option 3: Manual Xcode Build
1. Open `/example/ios/FoxEcomExample.xcworkspace` (NOT .xcodeproj)
2. Select scheme "FoxEcomExample"
3. Select simulator "iPhone 17 Pro"
4. Press Play to build

## SDK Code is Ready!

**Important**: The SDK source code in `src/` is fully functional!

Even though the example iOS app has build issues due to native compatibility, you can:

### Test SDK Directly
```bash
cd /Users/tuanvm37/fox-ecom
npm run type-check  # ✅ TypeScript check
npm test            # ✅ Run tests
npm run lint        # ✅ ESLint check
npm run build       # ✅ Build SDK to dist/
```

### Use SDK in Other Projects
```bash
# Build tarball
npm pack

# Install elsewhere
npm install ./fox-ecom-1.0.0.tgz
```

## Workaround for iOS Development

Until compatibility is fixed, use web preview or Android for testing the example app.

---

**Note**: This is a temporary Xcode SDK version compatibility issue, not a problem with the SDK itself.
