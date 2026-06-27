import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../../common/theme';
import { OrderStatus } from '../../../../modules/carry/types';

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'OPEN',       label: 'Đăng đơn' },
  { key: 'CLAIMED',    label: 'Nhận chở' },
  { key: 'IN_TRANSIT', label: 'Đang giao' },
  { key: 'DELIVERED',  label: 'Đã trao' },
  { key: 'CONFIRMED',  label: 'Hoàn thành' },
];

const STEP_ORDER: Record<OrderStatus, number> = {
  OPEN: 0, CLAIMED: 1, IN_TRANSIT: 2, DELIVERED: 3, CONFIRMED: 4,
  CANCELLED: -1, DISPUTED: -1,
};

interface StatusTimelineProps {
  status: OrderStatus;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ status }) => {
  if (status === 'CANCELLED') {
    return (
      <View style={s.cancelled}>
        <Text style={s.cancelledText}>🚫 Đơn đã bị huỷ</Text>
      </View>
    );
  }
  if (status === 'DISPUTED') {
    return (
      <View style={s.disputed}>
        <Text style={s.disputedText}>⚠️ Đang xử lý tranh chấp</Text>
      </View>
    );
  }

  const current = STEP_ORDER[status];

  return (
    <View style={s.row}>
      {STEPS.map((step, idx) => {
        const done   = idx < current;
        const active = idx === current;
        return (
          <React.Fragment key={step.key}>
            <View style={s.stepCol}>
              <View style={[s.dot, done && s.dotDone, active && s.dotActive]}>
                {done && <Text style={s.check}>✓</Text>}
                {active && <View style={s.activePulse} />}
              </View>
              <Text style={[s.stepLabel, (done || active) && s.stepLabelActive]} numberOfLines={1}>
                {step.label}
              </Text>
            </View>
            {idx < STEPS.length - 1 && (
              <View style={[s.connector, idx < current && s.connectorDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const DOT = 24;
const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.md },

  stepCol:  { alignItems: 'center', width: 52 },
  dot:      {
    width: DOT, height: DOT, borderRadius: DOT / 2,
    borderWidth: 2, borderColor: colors.iron,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  dotDone:   { backgroundColor: colors.primary, borderColor: colors.primary },
  dotActive: { borderColor: colors.primary, borderWidth: 2 },
  activePulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  check:    { ...typography.tiny, color: colors.white, fontWeight: '700' } as object,

  stepLabel:       { ...typography.tiny, color: colors.textTertiary, marginTop: 4, textAlign: 'center' } as object,
  stepLabelActive: { color: colors.primary, fontWeight: '700' },

  connector:     { flex: 1, height: 2, backgroundColor: colors.iron, marginTop: DOT / 2 - 1 },
  connectorDone: { backgroundColor: colors.primary },

  cancelled: { padding: spacing.md, backgroundColor: '#FEE8E9', borderRadius: borderRadius.sm },
  cancelledText: { ...typography.p2, color: colors.error, textAlign: 'center' } as object,
  disputed:  { padding: spacing.md, backgroundColor: '#FFF5E6', borderRadius: borderRadius.sm },
  disputedText: { ...typography.p2, color: '#CC6A00', textAlign: 'center' } as object,
});
