import React, { useState } from 'react';
import {
  TextInput, TextInputProps, View, Text,
  StyleSheet, TouchableOpacity, ViewStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius, layout } from '../../../common/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

/**
 * AppInput — Text input với FoxPro styling.
 * Focus ring: #284EEB · Error: #F43F4A · Border default: #CFD2D7
 */
export const AppInput: React.FC<AppInputProps> = ({
  label,
  hint,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.focusBlue
      : colors.border;

  const borderWidth = focused || error ? 2 : 1;

  return (
    <View style={[s.wrapper, containerStyle]}>
      {label && <Text style={s.label}>{label}</Text>}
      <View style={[s.container, { borderColor, borderWidth }]}>
        {leftIcon && <View style={s.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[s.input, leftIcon ? s.inputWithLeft : undefined, style]}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            style={s.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {(error || hint) && (
        <Text style={[s.helper, error ? s.helperError : undefined]}>
          {error ?? hint}
        </Text>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: { marginBottom: spacing.sm },
  label: {
    ...typography.c1,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  } as object,
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.fieldHeight,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    ...typography.p1,
    color: colors.text,
    padding: 0,
  } as object,
  inputWithLeft: { marginLeft: spacing.sm },
  leftIcon:  { marginRight: spacing.sm },
  rightIcon: { marginLeft: spacing.sm },
  helper: { ...typography.c2, color: colors.textTertiary, marginTop: 4 } as object,
  helperError: { color: colors.error },
});
