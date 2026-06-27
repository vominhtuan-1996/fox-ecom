import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { typography, spacing, borderRadius } from '../../../common/theme';
import { getTierInfo } from '../../../modules/rank/RankService';

interface TierBadgeProps {
  points: number;
  style?: ViewStyle;
  showIcon?: boolean;
}

/**
 * TierBadge — hiển thị hạng + màu tương ứng dựa trên điểm.
 */
export const TierBadge: React.FC<TierBadgeProps> = ({ points, style, showIcon = true }) => {
  const tier = getTierInfo(points);
  return (
    <View style={[s.badge, { backgroundColor: tier.color + '22', borderColor: tier.color + '66' }, style]}>
      {showIcon && <Text style={s.icon}>{tier.icon}</Text>}
      <Text style={[s.label, { color: tier.color }]}>{tier.label}</Text>
    </View>
  );
};

const s = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: borderRadius.pill, borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon:  { fontSize: 12, marginRight: 3 },
  label: { ...typography.c2, fontWeight: '700' } as object,
});
