import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../../common/theme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number | false;
  elevated?: boolean;
}

/**
 * AppCard — Card container FoxPro.
 * shadow: card (0 4px 16px rgba(0,0,0,.08))
 */
export const AppCard: React.FC<AppCardProps> = ({
  children,
  onPress,
  style,
  padding,
  elevated = true,
}) => {
  const innerStyle: ViewStyle[] = [
    s.card,
    elevated ? (shadows.card as ViewStyle) : {},
    { padding: padding === false ? 0 : (padding ?? spacing.lg) },
    style ?? {},
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={innerStyle} onPress={onPress} activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={innerStyle}>{children}</View>;
};

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});
