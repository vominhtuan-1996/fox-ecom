import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../common/theme';
import { AppBadge } from '../../components/shared/AppBadge';
import { Order, OrderStatus, ItemSize } from '../../../modules/carry/types';

const STATUS_LABEL: Record<OrderStatus, string> = {
  OPEN:       'Cần người chở',
  CLAIMED:    'Đã nhận chở',
  IN_TRANSIT: 'Đang giao',
  DELIVERED:  'Đã trao tận tay',
  CONFIRMED:  'Hoàn thành',
  CANCELLED:  'Đã huỷ',
  DISPUTED:   'Đang xử lý',
};

const STATUS_VARIANT: Record<OrderStatus, 'success' | 'info' | 'warning' | 'neutral' | 'error' | 'primary'> = {
  OPEN:       'primary',
  CLAIMED:    'info',
  IN_TRANSIT: 'warning',
  DELIVERED:  'success',
  CONFIRMED:  'success',
  CANCELLED:  'neutral',
  DISPUTED:   'error',
};

const SIZE_LABEL: Record<ItemSize, string> = { S: 'Nhỏ', M: 'Vừa', L: 'Lớn' };

function formatDeadline(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return 'Đã hết hạn';
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.floor(diff / 60000)} phút nữa`;
  if (h < 24) return `${h} giờ nữa`;
  return `${Math.floor(h / 24)} ngày nữa`;
}

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => (
  <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
    {/* Route */}
    <View style={s.routeRow}>
      <Text style={s.hub} numberOfLines={1}>{order.fromHub.shortName}</Text>
      <Text style={s.arrow}> → </Text>
      <Text style={s.hub} numberOfLines={1}>{order.toHub.shortName}</Text>
      <View style={s.flex} />
      <AppBadge label={STATUS_LABEL[order.status]} variant={STATUS_VARIANT[order.status]} />
    </View>

    {/* Item desc */}
    <Text style={s.itemDesc} numberOfLines={2}>{order.itemDesc}</Text>

    {/* Meta row */}
    <View style={s.metaRow}>
      <AppBadge label={SIZE_LABEL[order.itemSize]} variant="neutral" />
      <Text style={s.metaSep}>·</Text>
      <Text style={s.metaText}>⏰ {formatDeadline(order.deadline)}</Text>
      <View style={s.flex} />
      <Text style={s.points}>+{order.estimatedPoints}đ</Text>
      <Text style={s.co2}>  🌿 {order.estimatedCo2Kg} kg</Text>
    </View>

    {/* Sender */}
    <View style={s.senderRow}>
      <Text style={s.senderText}>Người gửi: {order.sender.name}</Text>
    </View>
  </TouchableOpacity>
);

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...(shadows.card as object),
  },
  routeRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  hub:        { ...typography.s2, color: colors.text, flexShrink: 1 } as object,
  arrow:      { ...typography.p2, color: colors.textTertiary } as object,
  flex:       { flex: 1 },
  itemDesc:   { ...typography.p2, color: colors.textSecondary, marginBottom: spacing.sm } as object,
  metaRow:    { flexDirection: 'row', alignItems: 'center' },
  metaSep:    { color: colors.textTertiary, marginHorizontal: spacing.xs },
  metaText:   { ...typography.c2, color: colors.textSecondary } as object,
  points:     { ...typography.c1, color: colors.primary, fontWeight: '700' } as object,
  co2:        { ...typography.c2, color: colors.green } as object,
  senderRow:  { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  senderText: { ...typography.c2, color: colors.textTertiary } as object,
});
