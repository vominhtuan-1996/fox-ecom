/**
 * SVG Icons
 * Reusable icon assets loaded as static resources
 *
 * Tech: Uses require() to load SVG files as static assets
 * Image component renders with tintColor for dynamic coloring
 * Works in both dev and production without needing SVG transformer
 */

export const ICONS = {
  // Main icons
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
