import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../../../common/theme';

interface SkeletonBoxProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

// Shimmer value shared across all boxes in same render cycle
const useShimmer = () => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return anim;
};

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = '100%',
  height = 16,
  radius,
  style,
}) => {
  const anim = useShimmer();
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] });
  return (
    <Animated.View
      style={[
        s.box,
        { width: width as any, height, borderRadius: radius ?? borderRadius.xs, opacity },
        style,
      ]}
    />
  );
};

/**
 * SkeletonOrderCard — placeholder cho OrderCard khi loading.
 */
export const SkeletonOrderCard: React.FC = () => (
  <View style={s.card}>
    <View style={s.row}>
      <SkeletonBox width="40%" height={14} />
      <View style={s.flex} />
      <SkeletonBox width={60} height={20} radius={999} />
    </View>
    <SkeletonBox width="80%" height={13} style={{ marginTop: spacing.sm }} />
    <SkeletonBox width="60%" height={13} style={{ marginTop: 6 }} />
    <View style={[s.row, { marginTop: spacing.md }]}>
      <SkeletonBox width={48} height={20} radius={999} />
      <SkeletonBox width={80} height={12} style={{ marginLeft: spacing.sm }} />
      <View style={s.flex} />
      <SkeletonBox width={40} height={12} />
    </View>
  </View>
);

/**
 * SkeletonList — render N placeholder cards.
 */
export const SkeletonList: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonOrderCard key={i} />
    ))}
  </>
);

const s = StyleSheet.create({
  box:  { backgroundColor: colors.iron },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  row:  { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
});
