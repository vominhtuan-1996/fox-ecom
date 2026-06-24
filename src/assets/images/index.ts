/**
 * Image Assets
 * PNG, JPG, and other image formats
 */

// Logos
export const LOGOS = {
  MAIN: require('./logo.png'),
  ICON: require('./logo-icon.png'),
  HORIZONTAL: require('./logo-horizontal.png'),
} as const;

// Placeholders
export const PLACEHOLDERS = {
  PRODUCT: require('./placeholder-product.png'),
  AVATAR: require('./placeholder-avatar.png'),
  BANNER: require('./placeholder-banner.png'),
} as const;

// Banners
export const BANNERS = {
  HERO: require('./hero-banner.png'),
  SALE: require('./sale-banner.png'),
  PROMO: require('./promo-banner.png'),
} as const;

export type LogoKey = keyof typeof LOGOS;
export type PlaceholderKey = keyof typeof PLACEHOLDERS;
export type BannerKey = keyof typeof BANNERS;
