// FoxPro Design System — Gradient definitions
// Dùng với react-native-linear-gradient hoặc tự vẽ bằng View layers

export const gradients = {
  /** Header cam — hero banner, HomeScreen header */
  orange: ['#FFC24D', '#FF8A00', '#FF8500'] as const,
  /** Brand purple */
  purple: ['#6E4BFF', '#2E008E'] as const,
  /** Subtle orange (2 stop) */
  orangeSimple: ['#FFA800', '#FF8500'] as const,
} as const;

export type GradientKey = keyof typeof gradients;
