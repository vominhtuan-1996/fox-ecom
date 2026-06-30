/**
 * SVG Icons
 * Reusable icon assets for menu and components
 *
 * Note: SVG files are included in the dist/ folder during build.
 * These are exported as file paths for runtime resolution by Metro/RN.
 */

export const ICONS = {
  HOME: require('./home.svg'),
  ALERT: require('./alert.svg'),
  CONFIRM: require('./confirm.svg'),
  DIALOG: require('./dialog.svg'),
  INPUT: require('./input.svg'),
  CUSTOM: require('./custom.svg'),
  BELL: require('./bell.svg'),
  LAYERS: require('./layers.svg'),
  SHOPPING_CART: require('./shopping-cart.svg'),
  PACKAGE: require('./package.svg'),
  HEART: require('./heart.svg'),
  SETTINGS: require('./settings.svg'),
  // V2 Design icons
  BELL_V2: require('./v2/bell.svg'),
  BADGE: require('./v2/badge.svg'),
  TREE: require('./v2/tree.svg'),
  LOCK: require('./v2/lock.svg'),
} as const;

export type IconKey = keyof typeof ICONS;
