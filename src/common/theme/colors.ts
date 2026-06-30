// Fox-Eco Design System — Color tokens
// Source: Fox-Eco-Design.md (29/06/2026, v1.0)
// Design System: FTel Carry — Mobile & Web

export const colors = {
  // ── PRIMARY COLORS (Brand: Orange) ────────────────────────────
  primary:         '#FF8500',   // primary-500: CTA chính, logo bg, brand
  primaryLight:    '#FFA800',   // primary-600: hover/pressed state
  primaryLightest: '#FFF1E6',   // primary-100: background highlight
  primaryDark:     '#FF8A00',   // primary-400: icon active, link visited

  // ── SECONDARY / ACCENT COLORS (Blue) ──────────────────────────
  secondary:       '#284EEB',   // accent-500: secondary CTA, link
  secondaryActive: '#5933EB',   // accent-600: active state accent
  secondaryLight:  '#6E4BFF',   // accent-400: badge, highlight
  secondaryDark:   '#2E008E',   // accent-deep: text accent on light bg

  // ── SEMANTIC COLORS ───────────────────────────────────────────
  success:         '#0BD78C',   // success-500: delivered, completed
  info:            '#16ADFF',   // info-500: tracking active, info notification
  error:           '#F43F4A',   // error-500: error, warning, cancel order
  warning:         '#FFC24D',   // warning-500: soft alert, timeout coming

  // ── TEXT / TYPOGRAPHY ─────────────────────────────────────────
  text:            '#111C36',   // text-900: primary text, heading
  textStrong:      '#3C4459',   // text-700: secondary text, subtitle
  textSecondary:   '#666D7C',   // text-500: label, caption, placeholder
  textTertiary:    '#A0A4AF',   // text-300: placeholder, disabled text
  textInverse:     '#FFFFFF',   // white text on dark bg

  // ── BORDER & DIVIDER ──────────────────────────────────────────
  border:          '#CFD2D7',   // border-300: default border
  borderLight:     '#E7E9EE',   // border-200: light divider
  borderLightest:  '#ECEDEF',   // border-100: subtle separator
  borderStrong:    '#A0A4AF',   // strong border

  // ── SURFACES & BACKGROUNDS ────────────────────────────────────
  background:      '#faf9f5',   // app background (warm off-white)
  surface:         '#FFFFFF',   // card/modal background
  surfaceLight:    '#FAFAFB',   // surface-100: lighter surface
  surfaceLighter:  '#F6F6F6',   // surface-200: card background
  surfacePeach:    '#FFF1E6',   // tinted-orange highlight

  // ── NEUTRALS / GRAYSCALE (Legacy) ──────────────────────────────
  white:           '#FFFFFF',
  black:           '#000000',
  gray50:          '#FAFAFB',   // lightest
  gray100:         '#F6F6F6',
  gray200:         '#ECEDEF',
  gray300:         '#CFD2D7',
  gray400:         '#A0A4AF',
  gray500:         '#666D7C',
  gray600:         '#3C4459',
  gray700:         '#3C4459',
  gray800:         '#111C36',   // darkest
  gray900:         '#111C36',
} as const;

export type ColorKey = keyof typeof colors;
