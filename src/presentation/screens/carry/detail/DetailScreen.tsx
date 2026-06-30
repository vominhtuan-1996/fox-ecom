import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../../../../common/theme';
import { AppCard } from '../../../components/shared/AppCard';
import { AppBadge } from '../../../components/shared/AppBadge';
import { AppText } from '../../../components/shared/AppText';
import { AppDivider } from '../../../components/shared/AppDivider';
import { StatusTimeline } from './StatusTimeline';
import { PartyCard } from './PartyCard';
import { ActionBar } from './ActionBar';
import { Order } from '../../../../modules/carry/types';
import { ConfettiView } from '../../../components/shared/ConfettiView';

type Role = 'sender' | 'carrier' | 'receiver' | 'other';

interface DetailScreenProps {
  order: Order;
  currentUserId?: string;
  onBack?: () => void;
  onShowQr?: () => void;
  onScanQr?: () => void;
  onClaim?: () => void;
  onCancel?: () => void;
  onReport?: () => void;
  onContact?: (userId: string) => void;
}

function resolveRole(order: Order, userId?: string): Role {
  if (!userId) return 'other';
  if (order.sender.id === userId)   return 'sender';
  if (order.receiver.id === userId) return 'receiver';
  if (order.carrier?.id === userId) return 'carrier';
  return 'other';
}

function formatVnd(n: number) {
  return n > 0 ? n.toLocaleString('vi-VN') + ' đ' : 'Không khai báo';
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const SIZE_LABEL: Record<string, string> = { S: 'Nhỏ (< 2 kg)', M: 'Vừa (2–5 kg)', L: 'Lớn (> 5 kg)' };
const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

export const DetailScreen: React.FC<DetailScreenProps> = ({
  order,
  currentUserId = 'u1',
  onBack,
  onShowQr,
  onScanQr,
  onClaim,
  onCancel,
  onReport,
  onContact,
}) => {
  const role = resolveRole(order, currentUserId);
  const isConfirmed = order.status === 'CONFIRMED';
  const [showConfetti, setShowConfetti] = useState(isConfirmed);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        <View style={s.headerRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.back}>‹</Text>
            </TouchableOpacity>
          )}
          <View style={s.headerCenter}>
            <Text style={s.orderId}>{order.id}</Text>
            <Text style={s.createdAt}>Đăng lúc {formatDate(order.createdAt)}</Text>
          </View>
          {onReport && role === 'carrier' && (
            <TouchableOpacity onPress={onReport} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.reportBtn}>⚑</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Timeline */}
        <StatusTimeline status={order.status} />
        <AppDivider margin={spacing.sm} />

        {/* Route card */}
        <AppCard style={s.card}>
          <AppText variant="c1" color="textSecondary" style={s.cardLabel}>TUYẾN ĐƯỜNG</AppText>
          <View style={s.routeRow}>
            <View style={s.hubBox}>
              <Text style={s.hubName}>{order.fromHub.name}</Text>
              <Text style={s.hubAddr}>{order.fromHub.address}</Text>
            </View>
            <Text style={s.arrow}>→</Text>
            <View style={s.hubBox}>
              <Text style={s.hubName}>{order.toHub.name}</Text>
              <Text style={s.hubAddr}>{order.toHub.address}</Text>
            </View>
          </View>
        </AppCard>

        {/* Item card */}
        <AppCard style={s.card}>
          <AppText variant="c1" color="textSecondary" style={s.cardLabel}>HÀNG HÓA</AppText>
          <Text style={s.itemDesc}>{order.itemDesc}</Text>
          <View style={s.itemMeta}>
            <AppBadge label={SIZE_LABEL[order.itemSize]} variant="neutral" />
            <Text style={s.itemValue}>Giá trị: {formatVnd(order.itemValueVnd)}</Text>
          </View>
          <AppDivider margin={spacing.sm} />
          <View style={s.co2Row}>
            <View style={s.co2Item}>
              <AppText variant="s2" color={isConfirmed ? 'primary' : 'textTertiary'}>
                {isConfirmed ? `+${order.actualPoints ?? order.estimatedPoints}` : `~${order.estimatedPoints}`}
              </AppText>
              <AppText variant="c2" color="textSecondary">điểm</AppText>
            </View>
            <View style={s.co2Item}>
              <AppText variant="s2" color={isConfirmed ? 'green' : 'textTertiary'}>
                🌿 {isConfirmed ? order.actualCo2Kg ?? order.estimatedCo2Kg : order.estimatedCo2Kg} kg
              </AppText>
              <AppText variant="c2" color="textSecondary">CO₂ tiết kiệm</AppText>
            </View>
            <View style={s.co2Item}>
              <AppText variant="c2" color="textTertiary" style={{ textAlign: 'center' }}>
                Deadline{'\n'}{formatDate(order.deadline)}
              </AppText>
            </View>
          </View>
          {!isConfirmed && (
            <AppText variant="c2" color="textTertiary" style={{ marginTop: spacing.xs }}>
              * Điểm và CO₂ là ước tính — xác nhận sau khi hoàn thành
            </AppText>
          )}
        </AppCard>

        {/* Party card */}
        <PartyCard
          sender={order.sender}
          receiver={order.receiver}
          carrier={order.carrier}
          onContact={onContact ? (u) => onContact(u.id) : undefined}
        />

        <View style={{ height: layout.tabBarHeight + spacing['3xl'] }} />
      </ScrollView>

      <ConfettiView visible={showConfetti} onDone={() => setShowConfetti(false)} />

      {/* Sticky action bar */}
      <View style={s.actionWrap}>
        <ActionBar
          order={order}
          role={role}
          onShowQr={onShowQr}
          onScanQr={onScanQr}
          onClaim={onClaim}
          onCancel={onCancel}
          onReport={onReport}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header:      { backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  headerRow:   { flexDirection: 'row', alignItems: 'center' },
  back:        { ...typography.h3, color: colors.text, lineHeight: 28, marginRight: spacing.md } as object,
  headerCenter:{ flex: 1 },
  orderId:     { ...typography.s2, color: colors.text } as object,
  createdAt:   { ...typography.c2, color: colors.textSecondary } as object,
  reportBtn:   { ...typography.s1, color: colors.error } as object,

  body:        { flex: 1 },
  bodyContent: { padding: spacing.lg },

  card:      { marginBottom: spacing.md },
  cardLabel: { marginBottom: spacing.sm, letterSpacing: 0.5, fontWeight: '700' } as object,

  routeRow:  { flexDirection: 'row', alignItems: 'flex-start' },
  hubBox:    { flex: 1 },
  hubName:   { ...typography.p2, color: colors.text, fontWeight: '600' } as object,
  hubAddr:   { ...typography.c2, color: colors.textSecondary, marginTop: 2 } as object,
  arrow:     { ...typography.h4, color: colors.textTertiary, marginHorizontal: spacing.sm, marginTop: 2 } as object,

  itemDesc:  { ...typography.p1, color: colors.text, marginBottom: spacing.sm } as object,
  itemMeta:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemValue: { ...typography.c2, color: colors.textSecondary } as object,

  co2Row:    { flexDirection: 'row' },
  co2Item:   { flex: 1, alignItems: 'center' },

  actionWrap: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.borderLight },
});
