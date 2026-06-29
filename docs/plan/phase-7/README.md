# Phase 7 — Gamification: Điểm, Hạng & Leaderboard

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Mục tiêu

Hệ thống điểm, hạng và bảng xếp hạng CO₂ — động lực tham gia chính của app.

---

## Thay đổi

| File | Loại | Mô tả |
|---|---|---|
| `src/modules/rank/RankService.ts` | Mới | 8 mock users, 5 phòng ban, tier system, company total |
| `src/modules/rank/index.ts` | Mới | Barrel export |
| `shared/TierBadge.tsx` | Mới | Pill badge hạng (màu + icon) dùng chung rank + profile |
| `shared/index.ts` | Sửa | Export TierBadge |
| `screens/rank/LeaderboardScreen.tsx` | Mới | Hero CO₂ card + 2 tab (cá nhân/phòng) + progress bar |
| `screens/rank/RankScreen.tsx` | Mới | Podium 3 bậc (2-1-3) + danh sách #4+ + sticky my-rank |
| `screens/rank/index.ts` | Mới | Barrel export |
| `example/SDKComponents.js` | Sửa | 2 demo: LeaderboardScreen + RankScreen |

---

## Thiết kế chi tiết

### Tier system
```
Bạch kim (#5933EB 💎): ≥ 2000 điểm
Vàng     (#F59E0B 🥇): ≥  500 điểm
Bạc      (#94A3B8 🥈): ≥  100 điểm
Đồng     (#CD7F32 🥉): ≥    0 điểm

getTierProgress(points) → 0..1 (% đến hạng tiếp theo)
```

### LeaderboardScreen
```
┌─ Header cam ──────────────────────┐
│  1.240 kg CO₂ toàn công ty       │
│  245 chuyến · 8 người             │
│  Của tôi: 🌿 22.4 kg · +320đ    │
├─ [Cá nhân] [Theo phòng] ──────────┤
│  #1 🥇 Trần Thị B  🌿 173.6 kg  │
│  #2 🥈 Đặng Minh G 🌿 86.8 kg   │
│  ...                               │
└────────────────────────────────────┘
```
Dept tab: progress bar `dept.co2Kg / maxCo2`, hiển thị số thành viên.

### RankScreen (Podium)
```
Layout podium: [#2][#1][#3] — thứ tự tả-trung-phải
Chiều cao bục: 80 - 110 - 64 px
Crown 👑 cho #1, huy chương cho #2/#3
Sticky footer: vị trí + CO₂ + TierBadge của currentUser
```

---

## Quyết định kỹ thuật

- **Podium order `[2,1,3]`** — truyền thống Olympic: trung tâm cao nhất.
- **`TierBadge` tách thành shared component** — dùng ở cả RankScreen, LeaderboardScreen và sắp dùng ở ProfileScreen (Phase 8).
- **Xếp hạng theo `co2Kg`** (không phải `points`) — CO₂ là metric chính của app, points là reward phụ.
- **DeptRow dùng `width: '%'`** cho progress bar — RN 0.65 support `%` string trong width khi parent có width cố định.
- **`podiumOrder = [top3[1], top3[0], top3[2]]`** — index map trực tiếp, không cần helper.
