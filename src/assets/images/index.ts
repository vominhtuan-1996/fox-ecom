/**
 * Image Assets
 * PNG, JPG, and other image formats
 */

// Image assets — excluded from SDK package
// Consuming apps should provide their own images
export const LOGOS = {} as const;
export const PLACEHOLDERS = {} as const;
export const BANNERS = {} as const;

export type LogoKey = keyof typeof LOGOS;
export type PlaceholderKey = keyof typeof PLACEHOLDERS;
export type BannerKey = keyof typeof BANNERS;
