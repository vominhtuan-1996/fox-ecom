import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet, ViewStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../common/theme';

interface AppSearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
  style?: ViewStyle;
}

/**
 * AppSearchBar — pill-shape search input.
 * Nền fill (#ECEDEF), không border nổi bật, show × khi có text.
 */
export const AppSearchBar: React.FC<AppSearchBarProps> = ({
  value = '',
  onChangeText,
  placeholder = 'Tìm kiếm...',
  onClear,
  onSubmit,
  autoFocus = false,
  style,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[s.container, focused && s.focused, style]}>
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => { onChangeText?.(''); onClear?.(); }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={s.clearBtn}>
            <View style={s.clearX} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.fill,
    paddingHorizontal: spacing.lg,
  },
  focused: { backgroundColor: colors.surface },
  input: {
    flex: 1,
    ...typography.p2,
    color: colors.text,
    padding: 0,
  } as object,
  clearBtn: {
    width: 18, height: 18,
    borderRadius: 9,
    backgroundColor: colors.grayChateau,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  clearX: { width: 8, height: 1.5, backgroundColor: colors.white, borderRadius: 1 },
});
