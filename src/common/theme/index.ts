export { colors } from './colors';
export type { ColorKey } from './colors';

export { fontSize, fontWeight, lineHeight, typography } from './typography';
export type { TypographyKey } from './typography';

export { spacing, borderRadius, shadows } from './spacing';

export const theme = {
  colors: require('./colors').colors,
  fontSize: require('./typography').fontSize,
  fontWeight: require('./typography').fontWeight,
  lineHeight: require('./typography').lineHeight,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  borderRadius: require('./spacing').borderRadius,
  shadows: require('./spacing').shadows,
} as const;
