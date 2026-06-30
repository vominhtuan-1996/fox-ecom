/**
 * Icon Map
 * Maps icon names to emoji (working solution for now)
 *
 * TODO: Replace with proper SVG rendering once:
 * - react-native-svg-transformer is installed
 * - metro.config.js is configured to handle SVG files
 * - SvgIcon component uses SVG transformer output
 *
 * SVG files are still in src/assets/icons/ and dist/assets/icons/
 * Ready to be used when transformer is set up
 */

export const ICON_MAP = {
  // Main icons (emoji mapping)
  HOME: '🏠',
  ALERT: '⚠️',
  CONFIRM: '✅',
  DIALOG: '💬',
  INPUT: '📝',
  CUSTOM: '👤',
  BELL: '🔔',
  LAYERS: '📚',
  SHOPPING_CART: '🛒',
  PACKAGE: '📦',
  HEART: '❤️',
  SETTINGS: '⚙️',
  // V2 Design icons
  BELL_V2: '🔔',
  BADGE: '🏆',
  TREE: '🌳',
  LOCK: '🔒',
} as const;

export type IconKey = keyof typeof ICON_MAP;

// Legacy export for compatibility
export const ICONS = ICON_MAP;
