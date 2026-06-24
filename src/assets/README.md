# Assets Folder Structure

This folder contains all static assets and configurations used by the Fox eCommerce SDK.

## Folder Organization

### `/icons`
**Purpose:** SVG icons and vector graphics
- **Files:** `*.svg`
- **Usage:** Reusable icons for UI components
- **Export:** `ICONS` object with typed keys

```typescript
import { ICONS } from '@/assets/icons';
// Usage: ICONS.CART, ICONS.SEARCH, etc.
```

### `/images`
**Purpose:** Image assets (PNG, JPG, WebP)
- **Files:** `*.png`, `*.jpg`, `*.jpeg`, `*.webp`
- **Categories:**
  - Logos: `logo.png`, `logo-icon.png`, etc.
  - Placeholders: `placeholder-*.png`
  - Banners: `*-banner.png`

```typescript
import { LOGOS, PLACEHOLDERS, BANNERS } from '@/assets/images';
// Usage: LOGOS.MAIN, PLACEHOLDERS.PRODUCT, etc.
```

### `/fonts`
**Purpose:** Font configurations and typography system
- **Files:** `*.ttf`, `*.otf` (actual font files in React Native linking)
- **Configuration:** Font families, sizes, weights, line heights
- **Features:**
  - Predefined font families (Roboto, Poppins, Courier)
  - Font size constants (XS to MASSIVE)
  - Font weight constants (LIGHT to BLACK)
  - Line height constants (TIGHT to LOOSE)

```typescript
import { FONTS, FONT_SIZES, FONT_WEIGHTS } from '@/assets/fonts';
// Usage: FONTS.ROBOTO_BOLD, FONT_SIZES.XL, FONT_WEIGHTS.SEMI_BOLD
```

### `/config`
**Purpose:** JSON configuration files and constants
- **Files:** `*.json`, configuration TypeScript exports
- **Includes:**
  - API endpoints
  - Feature flags
  - Storage keys
  - Error codes
  - Analytics events

```typescript
import { API_CONFIG, FEATURE_FLAGS, STORAGE_KEYS } from '@/assets/config';
// Usage: API_CONFIG.BASE_URL, FEATURE_FLAGS.ENABLE_ANALYTICS
```

### `/animations`
**Purpose:** Animation configurations and Lottie files
- **Files:** `*.json` (Lottie), animation presets
- **Includes:**
  - Animation durations
  - Easing functions
  - Animation presets (fade, slide, bounce, etc.)
  - Lottie animation JSON files

```typescript
import { ANIMATION_DURATIONS, ANIMATION_PRESETS } from '@/assets/animations';
// Usage: ANIMATION_DURATIONS.BASE, ANIMATION_PRESETS.FADE_IN
```

## Best Practices

1. **Type Safety:** All exports are typed for better IDE support and type checking
2. **Centralized Exports:** Each subfolder has an `index.ts` for easy importing
3. **Naming Conventions:**
   - Icons: kebab-case for files, UPPER_SNAKE_CASE for exports
   - Images: kebab-case with category prefix
   - Fonts: UPPER_SNAKE_CASE for family names
   - Config: UPPER_SNAKE_CASE for constants
   - Animations: UPPER_SNAKE_CASE for presets

4. **Import Pattern:**
   ```typescript
   // ✅ Good
   import { ICONS, LOGOS, FONTS } from '@/assets';
   
   // ❌ Avoid
   import ICONS from '@/assets/icons/index';
   ```

5. **Adding New Assets:**
   - Create file in appropriate subfolder
   - Add export to corresponding `index.ts`
   - Use the centralized export in components

## Example Usage

```typescript
import {
  ICONS,
  LOGOS,
  FONTS,
  FONT_SIZES,
  API_CONFIG,
  ANIMATION_PRESETS,
  STORAGE_KEYS,
} from '@/assets';

// Using icons
const cartIcon = ICONS.CART;

// Using fonts
const fontFamily = FONTS.ROBOTO_BOLD;
const fontSize = FONT_SIZES.XL;

// Using animations
const fadeDuration = ANIMATION_PRESETS.FADE_IN.duration;

// Using config
const apiBaseUrl = API_CONFIG.BASE_URL;
```

## Adding Font Files to React Native

For React Native projects, add fonts to `react-native.config.js`:

```javascript
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependency: {
    platforms: {
      ios: {},
      android: {},
    },
  },
  fonts: [
    './src/assets/fonts/Roboto-Regular.ttf',
    './src/assets/fonts/Roboto-Bold.ttf',
    './src/assets/fonts/Poppins-Regular.ttf',
  ],
};
```

Then run: `react-native link`

## File Size Optimization

- **Icons:** Use SVG when possible (scalable, smaller)
- **Images:** Optimize PNG/JPG files before adding
- **Fonts:** Include only necessary font weights
- **Lottie:** Keep JSON files minimal, avoid very large animations
