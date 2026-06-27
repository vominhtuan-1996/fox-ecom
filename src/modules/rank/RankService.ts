export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface RankUser {
  id: string;
  name: string;
  dept: string;
  points: number;
  co2Kg: number;
  trips: number;
  tier: RankTier;
}

export interface DeptRank {
  dept: string;
  co2Kg: number;
  trips: number;
  memberCount: number;
}

// ── Tier thresholds ───────────────────────────────────────────────────────────
const TIERS: { tier: RankTier; min: number; label: string; color: string; icon: string }[] = [
  { tier: 'platinum', min: 2000, label: 'Bạch kim', color: '#5933EB', icon: '💎' },
  { tier: 'gold',     min:  500, label: 'Vàng',     color: '#F59E0B', icon: '🥇' },
  { tier: 'silver',   min:  100, label: 'Bạc',      color: '#94A3B8', icon: '🥈' },
  { tier: 'bronze',   min:    0, label: 'Đồng',     color: '#CD7F32', icon: '🥉' },
];

export function getTierInfo(points: number) {
  return TIERS.find(t => points >= t.min) ?? TIERS[TIERS.length - 1];
}

export function getNextTier(points: number) {
  const idx = TIERS.findIndex(t => points >= t.min);
  return idx > 0 ? TIERS[idx - 1] : null;
}

export function getTierProgress(points: number): number {
  const current = getTierInfo(points);
  const next    = getNextTier(points);
  if (!next) return 1;
  const range = next.min - current.min;
  return Math.min((points - current.min) / range, 1);
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_USERS: RankUser[] = [
  { id: 'u1', name: 'Nguyễn Văn A',  dept: 'Phòng CNTT',        points: 320,  co2Kg: 22.4, trips: 12, tier: 'silver'   },
  { id: 'u2', name: 'Trần Thị B',    dept: 'Phòng Kinh doanh',  points: 2480, co2Kg: 173.6,trips: 89, tier: 'platinum' },
  { id: 'u3', name: 'Lê Minh C',     dept: 'Phòng Kỹ thuật',    points: 870,  co2Kg: 60.9, trips: 37, tier: 'gold'     },
  { id: 'u4', name: 'Phạm Thu D',    dept: 'Phòng Nhân sự',     points: 145,  co2Kg: 10.2, trips: 6,  tier: 'silver'   },
  { id: 'u5', name: 'Hoàng Văn E',   dept: 'Phòng Marketing',   points: 560,  co2Kg: 39.2, trips: 24, tier: 'gold'     },
  { id: 'u6', name: 'Vũ Thị F',      dept: 'Phòng CNTT',        points: 78,   co2Kg: 5.5,  trips: 4,  tier: 'bronze'   },
  { id: 'u7', name: 'Đặng Minh G',   dept: 'Phòng Kỹ thuật',    points: 1240, co2Kg: 86.8, trips: 51, tier: 'gold'     },
  { id: 'u8', name: 'Bùi Thị H',     dept: 'Phòng Kinh doanh',  points: 390,  co2Kg: 27.3, trips: 16, tier: 'silver'   },
];

const MOCK_DEPTS: DeptRank[] = [
  { dept: 'Phòng Kỹ thuật',   co2Kg: 147.7, trips: 88,  memberCount: 24 },
  { dept: 'Phòng Kinh doanh', co2Kg: 200.9, trips: 105, memberCount: 31 },
  { dept: 'Phòng CNTT',       co2Kg: 27.9,  trips: 16,  memberCount: 18 },
  { dept: 'Phòng Nhân sự',    co2Kg: 10.2,  trips: 6,   memberCount: 12 },
  { dept: 'Phòng Marketing',  co2Kg: 39.2,  trips: 24,  memberCount: 15 },
];

export const RankService = {
  getLeaderboard: (): RankUser[] =>
    [...MOCK_USERS].sort((a, b) => b.co2Kg - a.co2Kg),

  getDeptRank: (): DeptRank[] =>
    [...MOCK_DEPTS].sort((a, b) => b.co2Kg - a.co2Kg),

  getUser: (id: string): RankUser | undefined =>
    MOCK_USERS.find(u => u.id === id),

  getCompanyTotal: () => ({
    co2Kg: MOCK_USERS.reduce((s, u) => s + u.co2Kg, 0),
    trips: MOCK_USERS.reduce((s, u) => s + u.trips, 0),
    members: MOCK_USERS.length,
  }),
};
