import { TextStyle } from 'react-native';

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const fontWeight = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

export const typography = {
  // Display
  display: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
  } as TextStyle,

  // Heading
  h1: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
  } as TextStyle,

  h2: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  // Body
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  bodyMedium: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  bodySm: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  bodySmMedium: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  // Label
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  labelSm: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  // Caption
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  captionMedium: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  } as TextStyle,
} as const;

export type TypographyKey = keyof typeof typography;
