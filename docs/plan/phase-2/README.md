# Phase 2 — HomeScreen & CO₂ Impact Card

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Mục tiêu

Màn hình chính với header gradient cam, CO₂ impact card animated và grid 3 tính năng.

---

## Thay đổi

| File | Loại | Mô tả |
|---|---|---|
| `src/presentation/screens/home/Co2ImpactCard.tsx` | Mới | Card hero cam, 3 stat với `Animated.timing` count-up |
| `src/presentation/screens/home/FeatureGrid.tsx` | Mới | Grid 3 card: Giao hàng (active), Đón con + Đi làm chung (disabled, badge "Sắp có") |
| `src/presentation/screens/home/HomeScreen.tsx` | Mới | Màn hình chính — header cam, CO₂ card, feature grid |
| `src/presentation/screens/home/index.ts` | Mới | Barrel export |
| `example/SDKComponents.js` | Sửa | Import + demo HomeScreen (preview 600px), AppText, AppButton, AppInput, AppCard, AppBadge, AppAvatar, AppHeader |

---

## Thiết kế chi tiết

### HomeScreen layout
```
┌─────────────────────────────────┐
│ Header cam (#FF8500)            │
│  Xin chào 👋                    │
│  Nguyễn Văn A          [▣ QR]  │
│  [Avatar] Phòng CNTT · HCM     │
│           ⭐ 320 điểm · Bạc    │
├─────────────────────────────────┤  ← overlap -16px
│  ┌───────────────────────────┐  │
│  │  🌍  Cùng nhau bảo vệ MT │  │
│  │  1.240 kg │ 3.7 kg │52 km│  │
│  │  CO₂ cty  │ của tôi│ km  │  │
│  └───────────────────────────┘  │
│                                 │
│  Tính năng                      │
│  [📦 Giao] [👦 Đón*] [🚗 Chung*]│
└─────────────────────────────────┘
* badge "Sắp có", disabled
```

### CO₂ animated counter
- `Animated.timing` 1200ms ease → `interpolate` từ `0` → target value
- Format: `< 1kg → gram`, `≥ 1kg → X.X kg`

---

## Props công khai

### `HomeScreen`
| Prop | Type | Default |
|---|---|---|
| `userName` | `string` | `'Nguyễn Văn A'` |
| `onGoCarry` | `() => void` | — |
| `onGoQrScan` | `() => void` | — |

### `Co2ImpactCard`
| Prop | Type |
|---|---|
| `companyCo2Kg` | `number` |
| `personalCo2Kg` | `number` |
| `savedKm` | `number` |

---

## Quyết định kỹ thuật

- **Animated.Value interpolate** dùng string range `['0 kg', '1.2 kg']` — tránh cần state riêng cho số đếm.
- **HomeScreen không dùng `AppHeader`** — header custom overlap body scroll (negative marginTop trick), `AppHeader` phù hợp cho sub-screens.
- **FeatureGrid nhận `features[]` prop** — host có thể enable/disable tính năng mà không sửa component.
