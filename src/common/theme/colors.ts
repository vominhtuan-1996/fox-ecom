export const colors = {
  // Primary
  primary: '#FF6B35',
  primaryLight: '#FFB84D',
  primaryDark: '#D64423',

  // Secondary
  secondary: '#004E89',
  secondaryLight: '#1976D2',
  secondaryDark: '#003D7A',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Background
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceHover: '#F3F4F6',

  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Border
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
} as const;

export type ColorKey = keyof typeof colors;
