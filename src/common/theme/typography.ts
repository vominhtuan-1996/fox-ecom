// FoxPro Design System — Typography tokens
// Primary UI: SF Pro Display · Brand: Montserrat (sub SVN-Gilroy)
import { TextStyle } from 'react-native';

// ── Font families ────────────────────────────────────────────────
export const fontFamily = {
  ui:    'SF Pro Display',
  brand: 'Montserrat',
} as const;

// ── Font weights ─────────────────────────────────────────────────
export const fontWeight = {
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
  heavy:    '800' as const,
  black:    '900' as const,
} as const;

// ── Type scale — Fox-Eco Design System v1.0 ───────────────────────
// Source: Fox-Eco-Design.md § 3.2 Type Scale
export const typography = {
  // ── Fox-Eco-Design Standard Scale ─────────────────────────────────
  // Display: 28px / 700 / 36px — Heading màn hình chính
  display: { fontSize: 28, lineHeight: 36, fontWeight: fontWeight.bold } as TextStyle,

  // Heading 1: 24px / 700 / 32px — Section title
  h1: { fontSize: 24, lineHeight: 32, fontWeight: fontWeight.bold } as TextStyle,
  'heading-1': { fontSize: 24, lineHeight: 32, fontWeight: fontWeight.bold } as TextStyle,

  // Heading 2: 20px / 600 / 28px — Card title, modal title
  h2: { fontSize: 20, lineHeight: 28, fontWeight: fontWeight.semibold } as TextStyle,
  'heading-2': { fontSize: 20, lineHeight: 28, fontWeight: fontWeight.semibold } as TextStyle,

  // Heading 3: 18px / 600 / 24px — Sub-heading
  h3: { fontSize: 18, lineHeight: 24, fontWeight: fontWeight.semibold } as TextStyle,
  'heading-3': { fontSize: 18, lineHeight: 24, fontWeight: fontWeight.semibold } as TextStyle,

  // Body Large: 16px / 400 / 24px — Body text chính
  'body-large': { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular } as TextStyle,

  // Body: 14px / 400 / 20px — Text thông thường
  body: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.regular } as TextStyle,

  // Body Medium: 14px / 500 / 20px — Label, caption quan trọng
  'body-medium': { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.medium } as TextStyle,
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.medium } as TextStyle,

  // Caption: 12px / 400 / 16px — Meta info, timestamp
  caption: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular } as TextStyle,

  // Overline: 11px / 600 / 16px — Label nhỏ uppercase
  overline: { fontSize: 11, lineHeight: 16, fontWeight: fontWeight.semibold } as TextStyle,

  // ── Legacy compat aliases (FoxPro + old system) ──────────────────
  // Subtitles
  s1: { fontSize: 20, lineHeight: 28, fontWeight: fontWeight.semibold } as TextStyle,
  s2: { fontSize: 16, lineHeight: 22, fontWeight: fontWeight.semibold } as TextStyle,

  // Paragraphs
  p1: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular  } as TextStyle,
  p2: { fontSize: 14, lineHeight: 18, fontWeight: fontWeight.regular  } as TextStyle,
  p3: { fontSize: 13, lineHeight: 18, fontWeight: fontWeight.regular  } as TextStyle,

  // Captions
  c1: { fontSize: 13, lineHeight: 16, fontWeight: fontWeight.regular  } as TextStyle,
  c2: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular  } as TextStyle,

  // Utilities
  label:  { fontSize: 10, lineHeight: 12, fontWeight: fontWeight.bold    } as TextStyle,
  tiny:   { fontSize: 10, lineHeight: 12, fontWeight: fontWeight.regular } as TextStyle,
  button: { fontSize: 16, lineHeight: 16, fontWeight: fontWeight.bold    } as TextStyle,

  // Old body sizes
  bodySm:        { fontSize: 14, lineHeight: 18, fontWeight: fontWeight.regular } as TextStyle,
  bodySmMedium:  { fontSize: 14, lineHeight: 18, fontWeight: fontWeight.medium  } as TextStyle,
  captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.medium  } as TextStyle,
  labelSm:       { fontSize: 10, lineHeight: 12, fontWeight: fontWeight.medium  } as TextStyle,

  // Old heading sizes (FoxPro compat)
  h4: { fontSize: 22, lineHeight: 28, fontWeight: fontWeight.bold     } as TextStyle,
  h5: { fontSize: 18, lineHeight: 24, fontWeight: fontWeight.semibold } as TextStyle,
} as const;

// Legacy exports
export const fontSize = {
  xs: 12, sm: 14, base: 16, lg: 18,
  xl: 20, '2xl': 24, '3xl': 30, '4xl': 36,
} as const;

export const lineHeight = {
  tight: 1.2, normal: 1.5, relaxed: 1.75, loose: 2,
} as const;

// Union type for all available typography keys
export type TypographyKey = keyof typeof typography;
