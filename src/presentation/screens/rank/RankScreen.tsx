import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Platform, StatusBar,
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

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

// ── Podium step ───────────────────────────────────────────────────────────────
const PodiumStep: React.FC<{ user: RankUser; position: 1 | 2 | 3 }> = ({ user, position }) => {
  const heights   = { 1: 110, 2: 80, 3: 64 };
  const avatarSizes: ('lg' | 'md')[] = ['lg', 'md', 'md'];
  const podColors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
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
      <View style={[po.pedestal, { height: heights[position], backgroundColor: podColors[position] + (isFirst ? 'FF' : 'CC') }]}>
        <Text style={po.pedestalNum}>{position}</Text>
      </View>
    </View>
  );
};

const po = StyleSheet.create({
  wrap:      { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  wrapFirst: { marginBottom: 0 },
  medal:     { fontSize: 22, marginBottom: 4 },
  avatar:    { marginBottom: spacing.xs },
  name:      { ...typography.c1, color: colors.text, fontWeight: '700', marginBottom: 2, textAlign: 'center' } as object,
  co2:       { ...typography.tiny, color: colors.green, marginBottom: spacing.xs } as object,
  pedestal:  { width: '100%', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  pedestalNum: { ...typography.h4, color: colors.white, fontWeight: '900' } as object,
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
  row:    { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, backgroundColor: colors.surface },
  rowMe:  { backgroundColor: colors.surfacePeach },
  rank:   { width: 32, ...typography.c1, color: colors.textSecondary, fontWeight: '700' } as object,
  info:   { flex: 1, marginLeft: spacing.md },
  name:   { ...typography.p2, color: colors.text } as object,
  nameMe: { color: colors.primary, fontWeight: '700' },
  dept:   { ...typography.c2, color: colors.textSecondary } as object,
  right:  { alignItems: 'flex-end' },
  co2:    { ...typography.c1, color: colors.green, fontWeight: '700' } as object,
  pts:    { ...typography.c2, color: colors.textSecondary } as object,
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
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
        )}
        <AppText variant="s1" color="white" style={s.title}>Bảng vinh danh 🏆</AppText>
        <View style={{ width: 32 }} />
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
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
    backgroundColor: colors.primary,
  },
  back:  { ...typography.h3, color: colors.white, lineHeight: 28, marginRight: spacing.md } as object,
  title: { flex: 1 },

  podiumSection: {
    backgroundColor: colors.primary,
    paddingBottom: 0, paddingHorizontal: spacing.xl, paddingTop: spacing.md,
  },
  podiumRow: { flexDirection: 'row', alignItems: 'flex-end', height: 220 },

  restHeader: { padding: spacing.lg, paddingBottom: spacing.sm },

  myRankBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingBottom: spacing.md + (Platform.OS === 'ios' ? 20 : 0),
    ...(shadows.bar as object),
  },
  myRankLabel: { ...typography.c2, color: colors.textSecondary, marginRight: spacing.sm } as object,
  myRankNum:   { ...typography.s2, color: colors.text, marginRight: spacing.sm } as object,
  myRankCo2:   { ...typography.c1, color: colors.green, flex: 1 } as object,
});
