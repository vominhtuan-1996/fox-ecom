import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../common/theme';

interface OfflineBannerProps {
  visible: boolean;
}

/**
 * OfflineBanner — slide-down banner khi mất mạng.
 * Mount luôn, animate in/out theo `visible`.
 */
export const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] });

  return (
    <Animated.View style={[s.banner, { opacity: anim, transform: [{ translateY }] }]}>
      <Text style={s.text}>📡 Không có kết nối mạng</Text>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: colors.bigStone,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    zIndex: 999,
  },
  text: { ...typography.c1, color: colors.white } as object,
});
