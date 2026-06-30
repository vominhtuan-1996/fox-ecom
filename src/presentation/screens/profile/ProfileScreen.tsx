import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../../../common/theme';
import { AppText } from '../../components/shared/AppText';
import { AppAvatar } from '../../components/shared/AppAvatar';
import { AppCard } from '../../components/shared/AppCard';
import { AppDivider } from '../../components/shared/AppDivider';
import { TierBadge } from '../../components/shared/TierBadge';
import { AppProgressBar } from '../../components/shared/AppProgressBar';
import {
  RankService, getTierInfo, getNextTier, getTierProgress,
} from '../../../modules/rank/RankService';
import { HUBS } from '../../../modules/carry/CarryService';

interface ProfileScreenProps {
  userId?: string;
  onEdit?: () => void;
  onSettings?: () => void;
  onHistory?: () => void;
}


const MENU_ITEMS: { icon: string; label: string; sub: string; key: string; disabled?: boolean }[] = [
  { icon: '📋', label: 'Lịch sử đơn',   sub: 'Xem toàn bộ đơn đã giao / chở / nhận', key: 'history' },
  { icon: '🎁', label: 'Đổi thưởng',    sub: 'Dùng điểm đổi quà (sắp có)',           key: 'reward',  disabled: true },
  { icon: '⚙️', label: 'Cài đặt',       sub: 'Thông báo, bảo mật, v.v.',             key: 'settings' },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userId = 'u1',
  onEdit,
  onSettings,
  onHistory,
}) => {
  const user    = RankService.getUser(userId);
  const points  = user?.points ?? 0;
  const tier    = getTierInfo(points);
  const next    = getNextTier(points);
  const progress = getTierProgress(points);
  const defaultHub = HUBS[0];

  const handleMenu = (key: string) => {
    if (key === 'history')  onHistory?.();
    if (key === 'settings') onSettings?.();
  };

  return (
    <View style={s.root}>

      {/* Header */}
      <View style={[s.header, { paddingTop: spacing.sm }]}>
        <AppText variant="s1">Cá nhân</AppText>
        <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.editBtn}>✏️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.body}>

        {/* Avatar + name */}
        <View style={s.heroSection}>
          <TouchableOpacity onPress={onEdit} activeOpacity={0.8}>
            <AppAvatar name={user?.name} size="xl" />
            <View style={s.editOverlay}><Text style={s.editOverlayIcon}>📷</Text></View>
          </TouchableOpacity>
          <AppText variant="h4" style={s.userName}>{user?.name ?? 'Người dùng'}</AppText>
          <AppText variant="p2" color="textSecondary">{user?.dept}</AppText>
          <TierBadge points={points} style={s.tierBadge} />
        </View>

        {/* Stats grid */}
        <AppCard style={s.statsCard} elevated>
          <View style={s.statsGrid}>
            {[
              { label: 'Điểm',    value: points.toLocaleString() },
              { label: 'Chuyến',  value: user?.trips ?? 0 },
              { label: 'CO₂ (kg)', value: user?.co2Kg.toFixed(1) ?? '0' },
              { label: 'Uy tín',  value: '⭐ 4.9' },
            ].map((stat, i) => (
              <View key={i} style={[s.statItem, i % 2 === 0 && s.statItemBorderR, i < 2 && s.statItemBorderB]}>
                <AppText variant="h4" color="primary">{String(stat.value)}</AppText>
                <AppText variant="c2" color="textSecondary">{stat.label}</AppText>
              </View>
            ))}
          </View>
        </AppCard>

        {/* Tier progress */}
        <AppCard style={s.tierCard} elevated>
          <View style={s.tierHeader}>
            <View>
              <AppText variant="c1" color="textSecondary" style={{ marginBottom: 2 }}>HẠNG HIỆN TẠI</AppText>
              <View style={s.tierRow}>
                <Text style={s.tierIcon}>{tier.icon}</Text>
                <AppText variant="s1" style={{ color: tier.color }}>{tier.label}</AppText>
              </View>
            </View>
            {next && (
              <View style={s.nextTier}>
                <AppText variant="c2" color="textTertiary">Tiếp theo</AppText>
                <Text style={[s.nextTierLabel, { color: next.color }]}>{next.icon} {next.label}</Text>
              </View>
            )}
          </View>
          <AppProgressBar
            progress={progress}
            color={tier.color}
            trackColor={colors.fill}
            height={8}
            style={{ marginVertical: spacing.md }}
          />
          {next ? (
            <AppText variant="c2" color="textSecondary">
              Cần thêm <Text style={{ color: tier.color, fontWeight: '700' }}>{next.min - points} điểm</Text> để lên hạng {next.label}
            </AppText>
          ) : (
            <AppText variant="c2" color="primary">🎉 Bạn đang ở hạng cao nhất!</AppText>
          )}
        </AppCard>

        {/* Default route */}
        <AppCard style={s.routeCard} elevated>
          <AppText variant="c1" color="textSecondary" style={s.cardLabel}>TUYẾN THƯỜNG ĐI</AppText>
          <View style={s.routeRow}>
            <View style={s.routeItem}>
              <AppText variant="c2" color="textTertiary">Điểm đi</AppText>
              <AppText variant="p2">{defaultHub.shortName}</AppText>
            </View>
            <Text style={s.routeArrow}>→</Text>
            <View style={s.routeItem}>
              <AppText variant="c2" color="textTertiary">Điểm đến</AppText>
              <AppText variant="p2">{HUBS[1].shortName}</AppText>
            </View>
            <TouchableOpacity onPress={onEdit} style={s.routeEdit}>
              <Text style={s.routeEditIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
        </AppCard>

        {/* Menu */}
        <AppCard style={s.menuCard} padding={false} elevated>
          {MENU_ITEMS.map((item, i) => (
            <React.Fragment key={item.key}>
              <TouchableOpacity
                style={[s.menuRow, item.disabled && s.menuRowDisabled]}
                onPress={() => !item.disabled && handleMenu(item.key)}
                activeOpacity={item.disabled ? 1 : 0.7}
              >
                <Text style={s.menuIcon}>{item.icon}</Text>
                <View style={s.menuInfo}>
                  <AppText variant="p2" color={item.disabled ? 'textTertiary' : 'text'}>{item.label}</AppText>
                  <AppText variant="c2" color="textTertiary">{item.sub}</AppText>
                </View>
                <Text style={s.menuChevron}>{item.disabled ? '' : '›'}</Text>
              </TouchableOpacity>
              {i < MENU_ITEMS.length - 1 && <AppDivider margin={0} color={colors.borderSubtle} />}
            </React.Fragment>
          ))}
        </AppCard>

        <View style={{ height: layout.tabBarHeight + spacing['2xl'] }} />
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  editBtn: { fontSize: 20 },

  body: { paddingBottom: spacing['2xl'] },

  heroSection: { alignItems: 'center', paddingVertical: spacing['2xl'], backgroundColor: colors.surface },
  editOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
    ...(shadows.knob as object),
  },
  editOverlayIcon: { fontSize: 12 },
  userName:  { marginTop: spacing.md } as object,
  tierBadge: { marginTop: spacing.sm },

  statsCard: { margin: spacing.lg, marginTop: spacing.md, padding: 0 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  statItem:  { width: '50%', alignItems: 'center', paddingVertical: spacing.lg },
  statItemBorderR: { borderRightWidth: 1, borderRightColor: colors.borderSubtle },
  statItemBorderB: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },

  tierCard:   { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  tierHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tierRow:    { flexDirection: 'row', alignItems: 'center' },
  tierIcon:   { fontSize: 20, marginRight: spacing.xs },
  nextTier:   { alignItems: 'flex-end' },
  nextTierLabel: { ...typography.c1, fontWeight: '700' } as object,

  routeCard: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  cardLabel: { marginBottom: spacing.sm, fontWeight: '700', letterSpacing: 0.5 } as object,
  routeRow:  { flexDirection: 'row', alignItems: 'center' },
  routeItem: { flex: 1 },
  routeArrow:{ ...typography.h4, color: colors.textTertiary, marginHorizontal: spacing.sm } as object,
  routeEdit: { padding: spacing.xs },
  routeEditIcon: { fontSize: 16 },

  menuCard:       { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  menuRow:        { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  menuRowDisabled:{ opacity: 0.5 },
  menuIcon:       { fontSize: 22, marginRight: spacing.md },
  menuInfo:       { flex: 1 },
  menuChevron:    { ...typography.h4, color: colors.textTertiary } as object,
});
