# Phase 8 — Profile & Settings

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Mục tiêu

Hồ sơ cá nhân đầy đủ với stats, tier progress, tuyến mặc định và cài đặt thông báo.

---

## Thay đổi

| File | Loại | Mô tả |
|---|---|---|
| `shared/AppProgressBar.tsx` | Mới | Animated progress bar 0..1, dùng Animated.timing |
| `shared/index.ts` | Sửa | Export AppProgressBar |
| `screens/profile/ProfileScreen.tsx` | Mới | Avatar, stats 2×2 grid, tier card + progress, tuyến mặc định, menu |
| `screens/profile/EditProfileScreen.tsx` | Mới | Color picker 8 màu, display name input, hub picker tuyến mặc định |
| `screens/profile/SettingsScreen.tsx` | Mới | Toggle thông báo × 3, về ứng dụng, nút đăng xuất |
| `screens/profile/index.ts` | Mới | Barrel export |
| `example/SDKComponents.js` | Sửa | 3 demo: ProfileScreen, EditProfileScreen, SettingsScreen |

---

## Thiết kế chi tiết

### ProfileScreen layout
```
Header: [Cá nhân] [✏️ edit]
│
├── Hero section (surface bg)
│   └── Avatar (xl) + overlay 📷
│       Tên · Phòng ban
│       TierBadge
│
├── Stats card (2×2 grid)
│   Điểm | Chuyến
│   ──────┼──────
│   CO₂   | Uy tín ⭐
│
├── Tier card
│   Hạng hiện tại [icon + tên màu]   Tiếp theo →
│   ══════════════░░░░░░  (AppProgressBar animated)
│   "Cần thêm X điểm để lên hạng Y"
│
├── Tuyến mặc định card
│   FPT Tower → NVL Hub  [✏️]
│
└── Menu card
    📋 Lịch sử đơn  ›
    🎁 Đổi thưởng (disabled, opacity 0.5)
    ⚙️ Cài đặt      ›
```

### EditProfileScreen
- Color picker 8 màu preset (palette FoxPro), tap → highlight border `bigStone`
- Avatar preview realtime theo `avatarColor + displayName`
- Hub picker: 2 cột (từ / đến), scroll list 6 hub, radio-style highlight

### SettingsScreen
- 3 toggle thông báo (Switch): newOrder / myOrder / leaderboard
- About section: phiên bản, điều khoản, chính sách
- Nút "Đăng xuất" màu đỏ, border nhạt

---

## Quyết định kỹ thuật

- **`AppProgressBar` dùng `Animated.Value.interpolate` → `width: '%'`** — cách duy nhất animate width % trong RN 0.65 mà không cần `LayoutAnimation`.
- **Stats grid `width: '50%'`** — không dùng `flex: 1` trong `flexWrap` vì RN 0.65 không xử lý đúng.
- **EditProfile save là mock `setTimeout(600ms)`** — thay bằng `ProfileService.update()` khi có API.
- **SettingsScreen state local `toggles`** — persist bằng `AsyncStorage` khi production.
- **`colors.error + '44'`** — hex alpha string, RN hỗ trợ 8-digit hex từ 0.63+.
