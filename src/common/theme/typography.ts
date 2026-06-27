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

// ── Type scale (FoxPro specimen) ──────────────────────────────────
export const typography = {
  // Headings
  h1: { fontSize: 32, lineHeight: 38, fontWeight: fontWeight.heavy    } as TextStyle,
  h2: { fontSize: 30, lineHeight: 36, fontWeight: fontWeight.heavy    } as TextStyle,
  h3: { fontSize: 26, lineHeight: 32, fontWeight: fontWeight.heavy    } as TextStyle,
  h4: { fontSize: 22, lineHeight: 28, fontWeight: fontWeight.bold     } as TextStyle,
  h5: { fontSize: 18, lineHeight: 24, fontWeight: fontWeight.semibold } as TextStyle,

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

  // Legacy compat aliases (map cũ → mới)
  display:       { fontSize: 36, lineHeight: 44, fontWeight: fontWeight.heavy   } as TextStyle,
  body:          { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular } as TextStyle,
  bodyMedium:    { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.medium  } as TextStyle,
  bodySm:        { fontSize: 14, lineHeight: 18, fontWeight: fontWeight.regular } as TextStyle,
  bodySmMedium:  { fontSize: 14, lineHeight: 18, fontWeight: fontWeight.medium  } as TextStyle,
  caption:       { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular } as TextStyle,
  captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.medium  } as TextStyle,
  labelSm:       { fontSize: 10, lineHeight: 12, fontWeight: fontWeight.medium  } as TextStyle,
} as const;

// Legacy exports
export const fontSize = {
  xs: 12, sm: 14, base: 16, lg: 18,
  xl: 20, '2xl': 24, '3xl': 30, '4xl': 36,
} as const;

export const lineHeight = {
  tight: 1.2, normal: 1.5, relaxed: 1.75, loose: 2,
} as const;

export type TypographyKey = keyof typeof typography;
