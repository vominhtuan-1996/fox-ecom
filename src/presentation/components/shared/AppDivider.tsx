import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../../common/theme';

interface AppDividerProps {
  vertical?: boolean;
  color?: string;
  thickness?: number;
  margin?: number;
  style?: ViewStyle;
}

export const AppDivider: React.FC<AppDividerProps> = ({
  vertical = false,
  color = colors.fill,
  thickness = 1,
  margin,
  style,
}) => (
  <View
    style={[
      vertical ? s.vertical : s.horizontal,
      {
        [vertical ? 'width' : 'height']: thickness,
        backgroundColor: color,
        [vertical ? 'marginHorizontal' : 'marginVertical']: margin ?? spacing.md,
      },
      style,
    ]}
  />
);

const s = StyleSheet.create({
  horizontal: { alignSelf: 'stretch' },
  vertical:   { alignSelf: 'stretch' },
});
