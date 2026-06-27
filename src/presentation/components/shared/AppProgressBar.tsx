import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../../../common/theme';

interface AppProgressBarProps {
  progress: number;       // 0..1
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const AppProgressBar: React.FC<AppProgressBarProps> = ({
  progress,
  color = colors.primary,
  trackColor = colors.fill,
  height = 6,
  style,
  animated = true,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(anim, { toValue: progress, duration: 900, useNativeDriver: false }).start();
    } else {
      anim.setValue(progress);
    }
  }, [progress]);

  return (
    <View style={[s.track, { height, backgroundColor: trackColor, borderRadius: height / 2 }, style]}>
      <Animated.View
        style={[
          s.fill,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: color,
            width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
};

const s = StyleSheet.create({
  track: { overflow: 'hidden', alignSelf: 'stretch' },
  fill:  {},
});
