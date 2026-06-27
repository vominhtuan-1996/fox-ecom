import {
  getTierInfo,
  getNextTier,
  getTierProgress,
  RankService,
} from '../../src/modules/rank/RankService';

describe('getTierInfo', () => {
  it('returns bronze for 0 points',    () => expect(getTierInfo(0).tier).toBe('bronze'));
  it('returns bronze for 99 points',   () => expect(getTierInfo(99).tier).toBe('bronze'));
  it('returns silver at 100 points',   () => expect(getTierInfo(100).tier).toBe('silver'));
  it('returns silver at 499 points',   () => expect(getTierInfo(499).tier).toBe('silver'));
  it('returns gold at 500 points',     () => expect(getTierInfo(500).tier).toBe('gold'));
  it('returns gold at 1999 points',    () => expect(getTierInfo(1999).tier).toBe('gold'));
  it('returns platinum at 2000 points',() => expect(getTierInfo(2000).tier).toBe('platinum'));
  it('returns platinum above 2000',    () => expect(getTierInfo(9999).tier).toBe('platinum'));

  it('tier has label, color, icon', () => {
    const t = getTierInfo(150);
    expect(t.label).toBeTruthy();
    expect(t.color).toMatch(/^#/);
    expect(t.icon).toBeTruthy();
  });
});

describe('getNextTier', () => {
  it('next of bronze(50) → silver', () => expect(getNextTier(50)?.tier).toBe('silver'));
  it('next of silver(200) → gold',  () => expect(getNextTier(200)?.tier).toBe('gold'));
  it('next of gold(600) → platinum',() => expect(getNextTier(600)?.tier).toBe('platinum'));
  it('next of platinum → null',     () => expect(getNextTier(3000)).toBeNull());
});

describe('getTierProgress', () => {
  it('returns value in [0, 1]', () => {
    [0, 50, 99, 100, 300, 500, 1000, 2000, 5000].forEach(pts => {
      const p = getTierProgress(pts);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    });
  });

  it('returns 1 for platinum', () => expect(getTierProgress(3000)).toBe(1));

  it('increases within same tier', () => {
    const p10  = getTierProgress(10);
    const p50  = getTierProgress(50);
    expect(p50).toBeGreaterThan(p10);
  });
});

describe('RankService', () => {
  describe('getLeaderboard', () => {
    it('sorted by co2Kg descending', () => {
      const board = RankService.getLeaderboard();
      expect(board.length).toBeGreaterThan(0);
      for (let i = 1; i < board.length; i++) {
        expect(board[i - 1].co2Kg).toBeGreaterThanOrEqual(board[i].co2Kg);
      }
    });

    it('returns array of RankUser objects', () => {
      RankService.getLeaderboard().forEach(u => {
        expect(u.id).toBeTruthy();
        expect(u.name).toBeTruthy();
        expect(typeof u.co2Kg).toBe('number');
        expect(typeof u.points).toBe('number');
      });
    });
  });

  describe('getDeptRank', () => {
    it('sorted by co2Kg descending', () => {
      const depts = RankService.getDeptRank();
      expect(depts.length).toBeGreaterThan(0);
      for (let i = 1; i < depts.length; i++) {
        expect(depts[i - 1].co2Kg).toBeGreaterThanOrEqual(depts[i].co2Kg);
      }
    });

    it('depts have required fields', () => {
      RankService.getDeptRank().forEach(d => {
        expect(d.dept).toBeTruthy();
        expect(typeof d.co2Kg).toBe('number');
        expect(typeof d.trips).toBe('number');
      });
    });
  });

  describe('getCompanyTotal', () => {
    it('co2Kg is positive', () => expect(RankService.getCompanyTotal().co2Kg).toBeGreaterThan(0));
    it('trips is positive', () => expect(RankService.getCompanyTotal().trips).toBeGreaterThan(0));
    it('members count > 0', () => expect(RankService.getCompanyTotal().members).toBeGreaterThan(0));
  });

  describe('getUser', () => {
    it('returns user by id', () => {
      const u = RankService.getUser('u1');
      expect(u).toBeDefined();
      expect(u!.id).toBe('u1');
    });

    it('returns undefined for unknown id', () => {
      expect(RankService.getUser('nonexistent')).toBeUndefined();
    });
  });
});
