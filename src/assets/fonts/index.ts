/**
 * Font Assets
 * Font family configurations and type definitions
 */

export const FONTS = {
  // Primary fonts
  ROBOTO_REGULAR: 'Roboto-Regular',
  ROBOTO_MEDIUM: 'Roboto-Medium',
  ROBOTO_BOLD: 'Roboto-Bold',
  ROBOTO_BLACK: 'Roboto-Black',

  // Secondary fonts
  POPPINS_REGULAR: 'Poppins-Regular',
  POPPINS_SEMI_BOLD: 'Poppins-SemiBold',
  POPPINS_BOLD: 'Poppins-Bold',

  // Monospace (for code/prices)
  COURIER_REGULAR: 'Courier-Regular',
  COURIER_BOLD: 'Courier-Bold',
} as const;

export type FontFamily = typeof FONTS[keyof typeof FONTS];

/**
 * Font sizes
 */
export const FONT_SIZES = {
  XS: 10,
  SM: 12,
  BASE: 14,
  LG: 16,
  XL: 18,
  XXL: 20,
  XXXL: 24,
  HUGE: 32,
  MASSIVE: 40,
} as const;

/**
 * Font weights
 */
export const FONT_WEIGHTS = {
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMI_BOLD: '600',
  BOLD: '700',
  BLACK: '900',
} as const;

/**
 * Line heights
 */
export const LINE_HEIGHTS = {
  TIGHT: 1.2,
  NORMAL: 1.5,
  RELAXED: 1.75,
  LOOSE: 2,
} as const;
