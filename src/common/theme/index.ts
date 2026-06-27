export { colors } from './colors';
export type { ColorKey } from './colors';

export { fontFamily, fontWeight, fontSize, lineHeight, typography } from './typography';
export type { TypographyKey } from './typography';

export { spacing, borderRadius, shadows, layout } from './spacing';

export { gradients } from './gradients';
export type { GradientKey } from './gradients';

export const theme = {
  colors:       require('./colors').colors,
  fontFamily:   require('./typography').fontFamily,
  fontWeight:   require('./typography').fontWeight,
  fontSize:     require('./typography').fontSize,
  lineHeight:   require('./typography').lineHeight,
  typography:   require('./typography').typography,
  spacing:      require('./spacing').spacing,
  borderRadius: require('./spacing').borderRadius,
  shadows:      require('./spacing').shadows,
  layout:       require('./spacing').layout,
  gradients:    require('./gradients').gradients,
} as const;
