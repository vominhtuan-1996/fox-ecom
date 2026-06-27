import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../../../common/theme';
import { AppText } from '../../components/shared/AppText';
import { AppAvatar } from '../../components/shared/AppAvatar';
import { AppCard } from '../../components/shared/AppCard';
import { TierBadge } from '../../components/shared/TierBadge';
import { RankService, RankUser, DeptRank, getTierInfo } from '../../../modules/rank/RankService';

type LeaderboardTab = 'personal' | 'dept';

interface LeaderboardScreenProps {
  currentUserId?: string;
  onBack?: () => void;
  onOpenRank?: () => void;
}

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

// ── Hero CO₂ card ─────────────────────────────────────────────────────────────
const HeroCard: React.FC<{ currentUser?: RankUser }> = ({ currentUser }) => {
  const total = RankService.getCompanyTotal();
  return (
    <View style={h.card}>
      <Text style={h.label}>Tổng CO₂ công ty đã tiết kiệm</Text>
      <Text style={h.total}>{total.co2Kg.toFixed(1)} kg</Text>
      <Text style={h.sub}>{total.trips} chuyến · {total.members} người tham gia</Text>
      {currentUser && (
        <View style={h.personal}>
          <Text style={h.personalLabel}>Của tôi: </Text>
          <Text style={h.personalValue}>🌿 {currentUser.co2Kg.toFixed(1)} kg · +{currentUser.points} điểm</Text>
        </View>
      )}
    </View>
  );
};

const h = StyleSheet.create({
  card:          { backgroundColor: colors.primary, padding: spacing['2xl'], paddingTop: spacing.lg },
  label:         { ...typography.c1, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.xs } as object,
  total:         { ...typography.h2, color: colors.white, fontWeight: '900' } as object,
  sub:           { ...typography.c2, color: 'rgba(255,255,255,0.6)', marginTop: 4 } as object,
  personal:      { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, padding: spacing.md, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: borderRadius.sm },
  personalLabel: { ...typography.c2, color: 'rgba(255,255,255,0.7)' } as object,
  personalValue: { ...typography.c1, color: colors.white, fontWeight: '700' } as object,
});

// ── Personal row ──────────────────────────────────────────────────────────────
const PersonalRow: React.FC<{ user: RankUser; rank: number; isMe: boolean }> = ({ user, rank, isMe }) => {
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
  return (
    <View style={[p.row, isMe && p.rowMe]}>
      <Text style={p.rank}>{medal ?? `#${rank}`}</Text>
      <AppAvatar name={user.name} size="sm" />
      <View style={p.info}>
        <Text style={[p.name, isMe && p.nameMe]} numberOfLines={1}>{user.name}</Text>
        <Text style={p.dept} numberOfLines={1}>{user.dept}</Text>
      </View>
      <View style={p.right}>
        <Text style={p.co2}>🌿 {user.co2Kg.toFixed(1)} kg</Text>
        <TierBadge points={user.points} showIcon={false} />
      </View>
    </View>
  );
};

const p = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, backgroundColor: colors.surface },
  rowMe:  { backgroundColor: colors.surfacePeach },
  rank:   { width: 36, ...typography.s2, color: colors.textSecondary, textAlign: 'center' } as object,
  info:   { flex: 1, marginLeft: spacing.md },
  name:   { ...typography.p2, color: colors.text } as object,
  nameMe: { color: colors.primary, fontWeight: '700' },
  dept:   { ...typography.c2, color: colors.textSecondary } as object,
  right:  { alignItems: 'flex-end' },
  co2:    { ...typography.c1, color: colors.green, fontWeight: '700', marginBottom: 3 } as object,
});

// ── Dept row ──────────────────────────────────────────────────────────────────
const DeptRow: React.FC<{ dept: DeptRank; rank: number; maxCo2: number }> = ({ dept, rank, maxCo2 }) => {
  const pct = maxCo2 > 0 ? dept.co2Kg / maxCo2 : 0;
  return (
    <View style={d.row}>
      <Text style={d.rank}>#{rank}</Text>
      <View style={d.info}>
        <View style={d.nameRow}>
          <Text style={d.name} numberOfLines={1}>{dept.dept}</Text>
          <Text style={d.co2}>🌿 {dept.co2Kg.toFixed(1)} kg</Text>
        </View>
        <View style={d.barBg}>
          <View style={[d.barFill, { width: `${pct * 100}%` as any }]} />
        </View>
        <Text style={d.sub}>{dept.trips} chuyến · {dept.memberCount} thành viên</Text>
      </View>
    </View>
  );
};

const d = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, backgroundColor: colors.surface },
  rank:    { width: 32, ...typography.s2, color: colors.textSecondary } as object,
  info:    { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  name:    { ...typography.p2, color: colors.text, flex: 1 } as object,
  co2:     { ...typography.c1, color: colors.green, fontWeight: '700' } as object,
  barBg:   { height: 6, backgroundColor: colors.fill, borderRadius: 3, marginBottom: 4 },
  barFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  sub:     { ...typography.c2, color: colors.textSecondary } as object,
});

// ── Main screen ───────────────────────────────────────────────────────────────
export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  currentUserId = 'u1',
  onBack,
  onOpenRank,
}) => {
  const [tab, setTab] = useState<LeaderboardTab>('personal');

  const personalList = useMemo(() => RankService.getLeaderboard(), []);
  const deptList     = useMemo(() => RankService.getDeptRank(),    []);
  const currentUser  = useMemo(() => RankService.getUser(currentUserId), [currentUserId]);
  const myRank       = useMemo(() => personalList.findIndex(u => u.id === currentUserId) + 1, [personalList, currentUserId]);
  const maxDeptCo2   = deptList[0]?.co2Kg ?? 1;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Hero */}
      <View style={{ paddingTop: STATUS_H }}>
        <View style={s.headerRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.back}>‹</Text>
            </TouchableOpacity>
          )}
          <AppText variant="s2" color="white" style={s.headerTitle}>Xếp hạng</AppText>
          {onOpenRank && (
            <TouchableOpacity onPress={onOpenRank} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.podiumBtn}>🏆</Text>
            </TouchableOpacity>
          )}
        </View>
        <HeroCard currentUser={currentUser} />
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        {(['personal', 'dept'] as const).map(t => (
          <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>
              {t === 'personal' ? 'Cá nhân' : 'Theo phòng'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'personal' ? (
        <FlatList
          data={personalList}
          keyExtractor={u => u.id}
          renderItem={({ item, index }) => (
            <PersonalRow user={item} rank={index + 1} isMe={item.id === currentUserId} />
          )}
          ListFooterComponent={
            myRank > 0 ? (
              <View style={s.myRankFooter}>
                <Text style={s.myRankText}>Thứ hạng của tôi: #{myRank}</Text>
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: layout.tabBarHeight + spacing['2xl'] }}
        />
      ) : (
        <FlatList
          data={deptList}
          keyExtractor={d => d.dept}
          renderItem={({ item, index }) => (
            <DeptRow dept={item} rank={index + 1} maxCo2={maxDeptCo2} />
          )}
          contentContainerStyle={{ paddingBottom: layout.tabBarHeight + spacing['2xl'] }}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: colors.background },
  headerRow:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.primary },
  back:       { ...typography.h3, color: colors.white, lineHeight: 28, marginRight: spacing.md } as object,
  headerTitle:{ flex: 1 },
  podiumBtn:  { fontSize: 22 },

  tabBar:      { flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  tab:         { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive:   { borderBottomColor: colors.primary },
  tabText:     { ...typography.p2, color: colors.textSecondary } as object,
  tabTextActive: { color: colors.primary, fontWeight: '700' },

  myRankFooter: { padding: spacing.lg, alignItems: 'center' },
  myRankText:   { ...typography.c1, color: colors.textSecondary } as object,
});
