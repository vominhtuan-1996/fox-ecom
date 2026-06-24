/**
 * SVG Icons
 * Reusable icon assets for menu and components
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
} as const;

export type IconKey = keyof typeof ICONS;
