import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../common/theme';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'peach';

interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const BADGE_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  primary:   { bg: colors.surfacePeach, text: colors.primary },
  secondary: { bg: '#EEE9FD',          text: colors.secondary },
  success:   { bg: '#E6FBF3',          text: '#0A9E68' },
  warning:   { bg: '#FFF5E6',          text: '#CC6A00' },
  error:     { bg: '#FEE8E9',          text: colors.error },
  info:      { bg: '#E6F7FF',          text: '#0B83CC' },
  neutral:   { bg: colors.fill,        text: colors.textSecondary },
  peach:     { bg: colors.surfacePeach, text: colors.primary },
};

/**
 * AppBadge — pill label nhỏ với màu theo trạng thái.
 */
export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = 'neutral',
  style,
}) => {
  const { bg, text } = BADGE_COLORS[variant];
  return (
    <View style={[s.badge, { backgroundColor: bg }, style]}>
      <Text style={[s.label, { color: text }]}>{label}</Text>
    </View>
  );
};

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.c2,
    fontWeight: '600',
  } as object,
});
