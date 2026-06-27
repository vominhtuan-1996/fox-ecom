import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../../../common/theme';
import { AppButton } from '../../../components/shared/AppButton';
import { Order, OrderStatus } from '../../../../modules/carry/types';

type Role = 'sender' | 'carrier' | 'receiver' | 'other';

interface Action {
  label: string;
  variant?: 'primary' | 'outline' | 'danger' | 'secondary';
  onPress: () => void;
}

function getActions(order: Order, role: Role, cb: {
  onShowQr?: () => void;
  onScanQr?: () => void;
  onClaim?: () => void;
  onCancel?: () => void;
  onReport?: () => void;
}): Action[] {
  const { status } = order;

  if (role === 'sender') {
    if (status === 'OPEN')       return [{ label: 'Huỷ đơn', variant: 'danger',  onPress: cb.onCancel! }];
    if (status === 'CLAIMED')    return [{ label: 'Hiện mã QR giao hàng', onPress: cb.onShowQr! }];
    if (status === 'IN_TRANSIT') return [{ label: 'Đang giao — theo dõi', variant: 'outline', onPress: () => {} }];
    if (status === 'DELIVERED')  return [{ label: 'Hiện mã xác nhận nhận', onPress: cb.onShowQr! }];
    if (status === 'CONFIRMED')  return [];
  }

  if (role === 'carrier') {
    if (status === 'CLAIMED')    return [{ label: 'Quét mã người gửi', onPress: cb.onScanQr! }];
    if (status === 'IN_TRANSIT') return [
      { label: 'Quét mã người nhận', onPress: cb.onScanQr! },
      { label: 'Báo sự cố', variant: 'outline', onPress: cb.onReport! },
    ];
    if (status === 'CONFIRMED')  return [];
  }

  if (role === 'receiver') {
    if (status === 'DELIVERED')  return [{ label: 'Hiện mã xác nhận', onPress: cb.onShowQr! }];
    if (status === 'CONFIRMED')  return [];
  }

  // other / bystander — chỉ nhận chở khi OPEN
  if (status === 'OPEN') return [{ label: 'Nhận chở đơn này', onPress: cb.onClaim! }];

  return [];
}

interface ActionBarProps {
  order: Order;
  role: Role;
  onShowQr?: () => void;
  onScanQr?: () => void;
  onClaim?: () => void;
  onCancel?: () => void;
  onReport?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ order, role, ...cb }) => {
  const actions = getActions(order, role, cb);
  if (actions.length === 0) return null;

  return (
    <View style={s.bar}>
      {actions.map((a, i) => (
        <AppButton
          key={i}
          label={a.label}
          variant={a.variant ?? 'primary'}
          fullWidth
          onPress={a.onPress}
          style={i > 0 ? { marginTop: spacing.sm } : undefined}
        />
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  bar: { padding: spacing.lg, paddingBottom: spacing['2xl'] },
});
