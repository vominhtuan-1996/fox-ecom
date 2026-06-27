import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator,
  StyleSheet, ViewStyle, TextStyle, View,
} from 'react-native';
import { colors, typography, spacing, borderRadius, layout } from '../../../common/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

/**
 * AppButton — Button component FoxPro.
 * variant: primary (cam) · secondary (tím) · outline · ghost · danger
 */
export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  labelStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        s.base,
        s[`size_${size}`],
        s[`variant_${variant}`],
        fullWidth && s.fullWidth,
        isDisabled && s.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <View style={s.inner}>
          {icon && iconPosition === 'left' && <View style={s.iconLeft}>{icon}</View>}
          <Text style={[s.label, s[`label_${variant}`], s[`labelSize_${size}`], labelStyle]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && <View style={s.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.hitSlop,
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled:  { opacity: 0.45 },
  inner:     { flexDirection: 'row', alignItems: 'center' },
  iconLeft:  { marginRight: spacing.sm },
  iconRight: { marginLeft: spacing.sm },

  // sizes
  size_sm: { height: 36, paddingHorizontal: spacing.lg },
  size_md: { height: 44, paddingHorizontal: spacing.xl },
  size_lg: { height: layout.fieldHeight, paddingHorizontal: spacing['2xl'] },

  // variants — background
  variant_primary:   { backgroundColor: colors.primary },
  variant_secondary: { backgroundColor: colors.secondary },
  variant_outline:   { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  variant_ghost:     { backgroundColor: 'transparent' },
  variant_danger:    { backgroundColor: colors.error },

  // labels
  label: { ...typography.button } as TextStyle,
  label_primary:   { color: colors.white },
  label_secondary: { color: colors.white },
  label_outline:   { color: colors.primary },
  label_ghost:     { color: colors.primary },
  label_danger:    { color: colors.white },

  labelSize_sm: { fontSize: 13 },
  labelSize_md: { fontSize: 15 },
  labelSize_lg: { fontSize: 16 },
});
