import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../../../common/theme';
import { AppText } from '../../components/shared/AppText';
import { AppAvatar } from '../../components/shared/AppAvatar';
import { AppDivider } from '../../components/shared/AppDivider';
import { TierBadge } from '../../components/shared/TierBadge';
import { RankService, RankUser } from '../../../modules/rank/RankService';

interface RankScreenProps {
  currentUserId?: string;
  onBack?: () => void;
}


// ── Podium step ───────────────────────────────────────────────────────────────
const PodiumStep: React.FC<{ user: RankUser; position: 1 | 2 | 3 }> = ({ user, position }) => {
  const heights   = { 1: 110, 2: 80, 3: 64 };
  const avatarSizes: ('lg' | 'md')[] = ['lg', 'md', 'md'];
  const podColors = { 1: colors.warning, 2: colors.gray200, 3: colors.gray100 };
  const medals    = { 1: '👑', 2: '🥈', 3: '🥉' };
  const isFirst   = position === 1;

  return (
    <View style={[po.wrap, isFirst && po.wrapFirst]}>
      {/* Medal + avatar */}
      <Text style={po.medal}>{medals[position]}</Text>
      <AppAvatar name={user.name} size={avatarSizes[position - 1]} style={po.avatar} />
      <Text style={po.name} numberOfLines={1}>{user.name.split(' ').slice(-1)[0]}</Text>
      <Text style={po.co2}>🌿 {user.co2Kg.toFixed(1)} kg</Text>

      {/* Pedestal */}
      <View style={[po.pedestal, { height: heights[position], backgroundColor: podColors[position] + (isFirst ? 'FF' : '99') }]}>
        <Text style={po.pedestalNum}>{position}</Text>
      </View>
    </View>
  );
};

const po = StyleSheet.create({
  wrap:      { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  wrapFirst: { marginBottom: 0 },
  medal:     { ...typography.h2, marginBottom: spacing.xs, textAlign: 'center' },
  avatar:    { marginBottom: spacing.xs },
  name:      { ...typography.c1, color: colors.text, fontWeight: '700', marginBottom: spacing.xs, textAlign: 'center' } as object,
  co2:       { ...typography.caption, color: colors.success, marginBottom: spacing.xs } as object,
  pedestal:  { width: '100%', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: borderRadius.sm, borderTopRightRadius: borderRadius.sm },
  pedestalNum: { ...typography.h3, color: colors.white, fontWeight: '900' } as object,
});

// ── Rest list row ─────────────────────────────────────────────────────────────
const RestRow: React.FC<{ user: RankUser; rank: number; isMe: boolean }> = ({ user, rank, isMe }) => (
  <View style={[rr.row, isMe && rr.rowMe]}>
    <Text style={rr.rank}>#{rank}</Text>
    <AppAvatar name={user.name} size="sm" />
    <View style={rr.info}>
      <Text style={[rr.name, isMe && rr.nameMe]} numberOfLines={1}>{user.name}</Text>
      <Text style={rr.dept}>{user.dept}</Text>
    </View>
    <View style={rr.right}>
      <Text style={rr.co2}>🌿 {user.co2Kg.toFixed(1)} kg</Text>
      <Text style={rr.pts}>+{user.points}đ</Text>
    </View>
  </View>
);

const rr = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLightest, backgroundColor: colors.surface },
  rowMe:  { backgroundColor: colors.surfacePeach },
  rank:   { width: spacing.lg + spacing.sm, ...typography.c1, color: colors.textSecondary, fontWeight: '700', textAlign: 'center' } as object,
  info:   { flex: 1, marginLeft: spacing.md },
  name:   { ...typography.body, color: colors.text } as object,
  nameMe: { color: colors.primary, fontWeight: '700' },
  dept:   { ...typography.caption, color: colors.textSecondary } as object,
  right:  { alignItems: 'flex-end' },
  co2:    { ...typography.c1, color: colors.success, fontWeight: '700' } as object,
  pts:    { ...typography.caption, color: colors.textSecondary } as object,
});

// ── Main ──────────────────────────────────────────────────────────────────────
export const RankScreen: React.FC<RankScreenProps> = ({ currentUserId = 'u1', onBack }) => {
  const list    = RankService.getLeaderboard();
  const top3    = list.slice(0, 3);
  const rest    = list.slice(3);
  const myRank  = list.findIndex(u => u.id === currentUserId) + 1;
  const meUser  = list.find(u => u.id === currentUserId);

  // Podium order: 2 - 1 - 3
  const podiumOrder = [
    top3[1] as RankUser | undefined,
    top3[0] as RankUser | undefined,
    top3[2] as RankUser | undefined,
  ];

  return (
    <View style={s.root}>

      {/* Header */}
      <View style={s.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={{ top: spacing.md, bottom: spacing.md, left: spacing.md, right: spacing.md }}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
        )}
        <AppText variant="h1" color="textInverse" style={s.title}>Bảng vinh danh 🏆</AppText>
        <View style={{ width: spacing.lg + spacing.sm }} />
      </View>

      <FlatList
        data={rest}
        keyExtractor={u => u.id}
        renderItem={({ item, index }) => (
          <RestRow user={item} rank={index + 4} isMe={item.id === currentUserId} />
        )}
        ListHeaderComponent={
          <>
            {/* Podium */}
            <View style={s.podiumSection}>
              <View style={s.podiumRow}>
                {podiumOrder.map((user, i) => {
                  const pos = ([2, 1, 3] as const)[i];
                  return user ? (
                    <PodiumStep key={user.id} user={user} position={pos} />
                  ) : (
                    <View key={i} style={{ flex: 1 }} />
                  );
                })}
              </View>
            </View>

            <AppDivider margin={0} />
            <View style={s.restHeader}>
              <AppText variant="c1" color="textSecondary">Các thứ hạng tiếp theo</AppText>
            </View>
          </>
        }
        ListFooterComponent={<View style={{ height: layout.tabBarHeight + spacing['3xl'] + 60 }} />}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[]}
      />

      {/* My rank sticky footer */}
      {meUser && (
        <View style={s.myRankBar}>
          <Text style={s.myRankLabel}>Thứ hạng của tôi</Text>
          <Text style={s.myRankNum}>#{myRank}</Text>
          <Text style={s.myRankCo2}>🌿 {meUser.co2Kg.toFixed(1)} kg</Text>
          <TierBadge points={meUser.points} />
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.md,
    backgroundColor: colors.primary,
  },
  back:  { ...typography.h3, color: colors.textInverse, marginRight: spacing.md } as object,
  title: { flex: 1 },

  podiumSection: {
    backgroundColor: colors.primary,
    paddingBottom: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md,
  },
  podiumRow: { flexDirection: 'row', alignItems: 'flex-end', height: 220 },

  restHeader: { padding: spacing.lg, paddingBottom: spacing.sm },

  myRankBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.borderLight,
    paddingBottom: spacing.md + (Platform.OS === 'ios' ? spacing.lg : 0),
    ...(shadows.bar as object),
  },
  myRankLabel: { ...typography.caption, color: colors.textSecondary, marginRight: spacing.sm } as object,
  myRankNum:   { ...typography.h2, color: colors.text, marginRight: spacing.sm } as object,
  myRankCo2:   { ...typography.c1, color: colors.success, flex: 1 } as object,
});
