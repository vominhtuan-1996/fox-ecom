import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ViewStyle, Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing, layout } from '../../../common/theme';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  /** Gradient cam FoxPro — dùng cho HomeScreen và CARRY VIEW */
  variant?: 'default' | 'orange';
  style?: ViewStyle;
}

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

/**
 * AppHeader — header bar FoxPro.
 * variant="orange" → nền cam, text trắng (HomeScreen, BoardScreen)
 * variant="default" → nền trắng, text đen (ProfileScreen, v.v.)
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  variant = 'default',
  style,
}) => {
  const isOrange = variant === 'orange';
  const textColor = isOrange ? colors.white : colors.text;

  return (
    <View style={[s.wrapper, isOrange ? s.wrapperOrange : s.wrapperDefault, style]}>
      <View style={s.bar}>
        {/* Back */}
        <View style={s.left}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[s.backArrow, { color: textColor }]}>{'‹'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <View style={s.center}>
          {title && <Text style={[s.title, { color: textColor }]} numberOfLines={1}>{title}</Text>}
          {subtitle && <Text style={[s.subtitle, { color: isOrange ? 'rgba(255,255,255,0.75)' : colors.textSecondary }]}>{subtitle}</Text>}
        </View>

        {/* Right action */}
        <View style={s.right}>
          {rightAction}
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: {
    paddingTop: STATUS_BAR_HEIGHT,
  },
  wrapperDefault: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  wrapperOrange: {
    backgroundColor: colors.primary,
  },
  bar: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  left:   { width: 44, alignItems: 'flex-start' },
  center: { flex: 1, alignItems: 'center' },
  right:  { width: 44, alignItems: 'flex-end' },
  backBtn: { padding: 4 },
  backArrow: { ...typography.h3, lineHeight: 26 } as object,
  title:    { ...typography.s2, textAlign: 'center' } as object,
  subtitle: { ...typography.c2 } as object,
});
