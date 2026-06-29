# Phase 10 — Navigation + Native Features + Testing

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Track A — Navigation

### Cấu trúc navigator
```
AppRoot
├── TabNavigator (4 tab)
│   ├── [Trang chủ]  → HomeStack
│   │     └── HomeScreen
│   ├── [Xếp hạng]   → RankStack
│   │     ├── LeaderboardScreen
│   │     └── RankScreen (Podium)
│   ├── [Hoạt động]  → OrdersStack
│   │     ├── MyOrdersScreen
│   │     └── DetailScreen (shared)
│   └── [Cá nhân]    → ProfileStack
│         ├── ProfileScreen
│         ├── EditProfileScreen
│         └── SettingsScreen
│
└── CarryStack (fullscreen, no tab bar)
      ├── BoardScreen
      ├── CreateScreen
      ├── DetailScreen
      ├── ShowQrScreen
      ├── ScanScreen
      └── RouteFilterScreen (modal)
```

### Files
- `app/TabNavigator.tsx` — tab bar + 4 stack navigators
- `app/CarryNavigator.tsx` — carry flow (push từ Home)
- `app/AppNavigator.tsx` — root, switch giữa Tab và Carry

---

## Track B — Native Features

### Camera QR scan
- `screens/qr/CamScanScreen.tsx` — wrap `react-native-camera` hoặc placeholder
- Fallback: nếu chưa có native module → ScanScreen manual mode

### Push notification (placeholder)
- `modules/notification/NotificationService.ts` — mock service
- handler khi tap notification → navigate đến DetailScreen

---

## Track C — Testing

### Unit tests (Jest)
- `__tests__/carry/CarryService.test.ts`
- `__tests__/carry/calcEstimate.test.ts`
- `__tests__/qr/QrService.test.ts`
- `__tests__/rank/RankService.test.ts`
- `__tests__/rank/tierUtils.test.ts`
- `__tests__/carry/ActionBar.test.ts` — role × status matrix

### Target: ≥ 80% coverage cho `src/modules/`
