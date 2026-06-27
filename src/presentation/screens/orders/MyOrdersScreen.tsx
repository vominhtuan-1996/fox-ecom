import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing, layout } from '../../../common/theme';
import { AppText } from '../../components/shared/AppText';
import { OrderCard } from '../carry/OrderCard';
import { CarryService } from '../../../modules/carry/CarryService';
import { Order } from '../../../modules/carry/types';

type CarryTab = 'sent' | 'carried' | 'received';
type FeatureTab = 'carry' | 'kids' | 'commute';

interface MyOrdersScreenProps {
  currentUserId?: string;
  onOpenOrder?: (order: Order) => void;
  onBack?: () => void;
}

const FEATURE_TABS: { key: FeatureTab; label: string; available: boolean }[] = [
  { key: 'carry',   label: 'Giao hàng',    available: true },
  { key: 'kids',    label: 'Đón con',       available: false },
  { key: 'commute', label: 'Đi làm chung', available: false },
];

const CARRY_TABS: { key: CarryTab; label: string }[] = [
  { key: 'sent',     label: 'Tôi gửi' },
  { key: 'carried',  label: 'Tôi chở' },
  { key: 'received', label: 'Tôi nhận' },
];

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

export const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({
  currentUserId = 'u1',
  onOpenOrder,
  onBack,
}) => {
  const [featureTab, setFeatureTab] = useState<FeatureTab>('carry');
  const [carryTab,   setCarryTab]   = useState<CarryTab>('sent');

  const allMyOrders = useMemo(
    () => CarryService.getMyOrders(currentUserId),
    [currentUserId],
  );

  const filtered = useMemo(() => {
    if (featureTab !== 'carry') return [];
    return allMyOrders.filter(o => {
      if (carryTab === 'sent')     return o.sender.id === currentUserId;
      if (carryTab === 'carried')  return o.carrier?.id === currentUserId;
      if (carryTab === 'received') return o.receiver.id === currentUserId;
      return false;
    });
  }, [allMyOrders, featureTab, carryTab, currentUserId]);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={s.backBtn}>
            <Text style={s.backArrow}>‹</Text>
          </TouchableOpacity>
        )}
        <AppText variant="s1">Hoạt động</AppText>
      </View>

      {/* Feature tabs */}
      <View style={s.featureTabBar}>
        {FEATURE_TABS.map(ft => (
          <TouchableOpacity
            key={ft.key}
            style={[s.featureTab, featureTab === ft.key && s.featureTabActive]}
            onPress={() => ft.available && setFeatureTab(ft.key)}
            activeOpacity={ft.available ? 0.7 : 1}
          >
            <Text style={[s.featureTabText, featureTab === ft.key && s.featureTabTextActive, !ft.available && s.featureTabTextDisabled]}>
              {ft.label}
            </Text>
            {!ft.available && (
              <View style={s.soonChip}>
                <Text style={s.soonChipText}>Sắp có</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {featureTab === 'carry' ? (
        <>
          {/* Carry sub-tabs */}
          <View style={s.carryTabBar}>
            {CARRY_TABS.map(ct => (
              <TouchableOpacity
                key={ct.key}
                style={[s.carryTab, carryTab === ct.key && s.carryTabActive]}
                onPress={() => setCarryTab(ct.key)}
              >
                <Text style={[s.carryTabText, carryTab === ct.key && s.carryTabTextActive]}>
                  {ct.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filtered}
            keyExtractor={o => o.id}
            renderItem={({ item }) => (
              <OrderCard order={item} onPress={() => onOpenOrder?.(item)} />
            )}
            contentContainerStyle={s.list}
            ListEmptyComponent={<EmptyState tab={carryTab} />}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <ComingSoon />
      )}
    </View>
  );
};

const EmptyState: React.FC<{ tab: CarryTab }> = ({ tab }) => {
  const msgs: Record<CarryTab, string> = {
    sent:     'Bạn chưa đăng đơn giao hàng nào',
    carried:  'Bạn chưa nhận chở đơn nào',
    received: 'Bạn chưa nhận hàng nào',
  };
  return (
    <View style={s.empty}>
      <Text style={s.emptyIcon}>📭</Text>
      <AppText variant="p2" color="textSecondary" align="center">{msgs[tab]}</AppText>
    </View>
  );
};

const ComingSoon: React.FC = () => (
  <View style={s.comingSoon}>
    <Text style={s.comingSoonIcon}>🚧</Text>
    <AppText variant="s2" color="textSecondary" align="center">Tính năng đang phát triển</AppText>
    <AppText variant="p2" color="textTertiary" align="center" style={{ marginTop: spacing.sm }}>
      Sẽ sớm ra mắt trong phiên bản tiếp theo
    </AppText>
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  backBtn:   { marginRight: spacing.md },
  backArrow: { ...typography.h3, color: colors.text, lineHeight: 28 } as object,

  // Feature tabs (Giao hàng / Đón con / Đi làm chung)
  featureTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  featureTab: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm,
    marginRight: spacing.xl,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  featureTabActive:    { borderBottomColor: colors.primary },
  featureTabText:      { ...typography.p2, color: colors.textSecondary } as object,
  featureTabTextActive:{ color: colors.primary, fontWeight: '700' },
  featureTabTextDisabled: { color: colors.textTertiary },
  soonChip: {
    marginLeft: spacing.xs, backgroundColor: colors.fill,
    borderRadius: 999, paddingHorizontal: 5, paddingVertical: 1,
  },
  soonChipText: { ...typography.tiny, color: colors.textTertiary, fontWeight: '700' } as object,

  // Carry sub-tabs (Tôi gửi / Tôi chở / Tôi nhận)
  carryTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  carryTab:     {
    flex: 1, alignItems: 'center', paddingVertical: spacing.sm,
    borderRadius: 999, marginHorizontal: spacing.xs,
  },
  carryTabActive:    { backgroundColor: colors.surface },
  carryTabText:      { ...typography.c1, color: colors.textSecondary } as object,
  carryTabTextActive:{ color: colors.text, fontWeight: '700' },

  list:      { padding: spacing.lg, paddingBottom: layout.tabBarHeight + spacing['3xl'] },
  empty:     { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.lg },

  comingSoon:     { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  comingSoonIcon: { fontSize: 48, marginBottom: spacing.lg },
});
