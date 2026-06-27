import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { typography, TypographyKey, colors, ColorKey } from '../../../common/theme';

interface AppTextProps extends TextProps {
  variant?: TypographyKey;
  color?: ColorKey | string;
  align?: TextStyle['textAlign'];
  children?: React.ReactNode;
}

/**
 * AppText — Text component với FoxPro typography variants.
 *
 * @example
 * <AppText variant="h3">Tiêu đề</AppText>
 * <AppText variant="p2" color="textSecondary">Mô tả phụ</AppText>
 */
export const AppText: React.FC<AppTextProps> = ({
  variant = 'p2',
  color,
  align,
  style,
  children,
  ...rest
}) => {
  const colorValue = color
    ? (colors as Record<string, string>)[color] ?? color
    : colors.text;

  return (
    <Text
      style={[
        typography[variant],
        { color: colorValue },
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
