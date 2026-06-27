// FoxPro Design System — Color tokens
// Source: Fox Pro - Design System.fig (FPT Telecom · UXUI Team)

export const colors = {
  // ── Brand ────────────────────────────────────────────────────
  primary:       '#FF8500',   // Flush Orange — brand primary
  primaryLight:  '#FFA800',   // gradient start
  primaryDark:   '#E67600',
  secondary:     '#5933EB',   // Royal Blue — brand secondary
  secondaryLight:'#6E4BFF',   // gradient start
  secondaryDark: '#2E008E',   // gradient end

  // ── Accent ───────────────────────────────────────────────────
  green:         '#0BD78C',   // Harlequin — success / CO₂
  blue:          '#16ADFF',   // Dodger Blue — info / link
  focusBlue:     '#284EEB',   // input focus ring

  // ── Semantic ─────────────────────────────────────────────────
  success:       '#0BD78C',
  warning:       '#FF8500',
  error:         '#F43F4A',   // Red Orange
  info:          '#16ADFF',

  // ── Neutrals (light → dark) ───────────────────────────────────
  white:         '#FFFFFF',
  athensGray:    '#FAFAFB',   // app background
  mist:          '#F6F6F6',   // header / hairline
  fill:          '#ECEDEF',   // dividers / section fill
  iron:          '#CFD2D7',   // borders
  grayChateau:   '#A0A4AF',   // muted text / icon
  paleSky:       '#666D7C',   // secondary text
  oxfordBlue:    '#3C4459',   // strong text
  bigStone:      '#111C36',   // primary text
  black:         '#000000',

  // ── Surfaces ─────────────────────────────────────────────────
  background:    '#FAFAFB',
  surface:       '#FFFFFF',
  surfaceSubtle: '#F6F6F6',
  surfacePeach:  '#FFF1E6',   // tinted-orange highlight

  // ── Text aliases ─────────────────────────────────────────────
  text:          '#111C36',
  textSecondary: '#666D7C',
  textTertiary:  '#A0A4AF',
  textStrong:    '#3C4459',
  textInverse:   '#FFFFFF',
  textLink:      '#16ADFF',

  // ── Border aliases ────────────────────────────────────────────
  border:        '#CFD2D7',
  borderSubtle:  '#F6F6F6',
  borderStrong:  '#A0A4AF',

  // ── Legacy aliases (compat cũ, xóa dần) ──────────────────────
  gray50:  '#FAFAFB',
  gray100: '#F6F6F6',
  gray200: '#ECEDEF',
  gray300: '#CFD2D7',
  gray400: '#A0A4AF',
  gray500: '#666D7C',
  gray600: '#3C4459',
  gray700: '#3C4459',
  gray800: '#111C36',
  gray900: '#111C36',
} as const;

export type ColorKey = keyof typeof colors;
