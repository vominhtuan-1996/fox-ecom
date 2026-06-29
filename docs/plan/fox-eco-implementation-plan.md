# Kế hoạch triển khai — Tiện đường (FTel Carry) v2

> Dựa trên prototype `Fox_Eco_V2.html` — FPT Telecom internal delivery app.
> SDK: `fox-ecom` · RN 0.77.3 · React 18.3.1 · Design system: FoxPro

---

## Tổng quan sản phẩm

App nội bộ cho phép nhân viên FPT Telecom **giao hàng tiện đường**.  
3 vai trò: **A (Người gửi)** → **B (Người chở)** → **C (Người nhận)**  
Địa chỉ pickup/dropoff **tự do** (không giới hạn hub nội bộ).  
Hệ thống **thông báo** push + in-app cho mọi cập nhật đơn.

**Phase 1:** Giao hàng (core flow)  
**Phase 2:** Đón con + Đi làm chung (roadmap)

---

## Thay đổi chính V1 → V2

| Hạng mục | V1 | V2 |
|---|---|---|
| Địa chỉ đơn | Hub cố định (dropdown 6 hub) | Địa chỉ tự do (city/ward/street/house/phone/name) |
| QR Scan | Có (ScanScreen, ShowQrScreen, CamScanScreen) | **Bỏ** (xóa toàn bộ flow QR) |
| Thông báo | Không có | **Thêm mới** (bell icon + badge + NotificationsScreen) |
| Tab order | Trang chủ / Xếp hạng / Hoạt động / Cá nhân | Trang chủ / **Hoạt động** / **Xếp hạng** / Cá nhân |
| HomeScreen design | Gradient cam đậm, globe image, cards trắng | Gradient xanh lá nhạt, TreesGlyph SVG, glassmorphism cards |
| Date/time picker | Preset cứng (hôm nay 18h, 20h...) | Date input + time input tự chọn |
| Header QR button | Có (tất cả screens) | **Bỏ** — thay bằng Bell icon |

---

## Design System — FoxPro Tokens

### Colors
| Token | Value | Semantic |
|---|---|---|
| `flushOrange` | `#FF8500` | Brand primary |
| `royalBlue` | `#5933EB` | Brand secondary |
| `harlequin` | `#0BD78C` | Success / CO₂ |
| `dodgerBlue` | `#16ADFF` | Info / link |
| `redOrange` | `#F43F4A` | Danger |
| `bigStone` | `#111C36` | Text primary |
| `athensGray` | `#FAFAFB` | App background |
| `gradientOrange` | `#FFA800 → #FF8500` | Feature card active |
| `gradientGreen` | `#CDEBD2 → #F5F9E8 → #FFF3E0` | HomeScreen hero background |
| `surfacePeach` | `#FFF1E6` | Highlight cam |
| `glassCard` | `rgba(255,255,255,0.45)` | Glassmorphism card bg |

### Typography
- **UI font:** SF Pro Display (400/500/600/700/800/900)
- **Brand font:** Montserrat (600/700/800)
- Scale: H1(32/800) H2(30) H3(26) H4(22) H5(18) · S1(20) S2(16) · P1(16) P2(14) P3(13) · C1(13) C2(12) · Label(10/700) · Button(16/700)

### Spacing (4px base)
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80`

### Radius
`xs:4 · sm:8 · md:12 · lg:16 · pill:999`

### Shadows
`card: 0 4px 16px rgba(0,0,0,.08)` · `pop: 0 8px 24px rgba(17,28,54,.12)`

---

## Màn hình tổng quan (14 screens)

| # | Screen | Vai trò | V2 change |
|---|---|---|---|
| 1 | HomeScreen | Tab chính — CO₂ impact + menu + bell | ✏️ Redesign xanh lá, glassmorphism |
| 2 | NotificationsScreen | Danh sách thông báo đơn hàng | 🆕 Mới hoàn toàn |
| 3 | BoardScreen | Bảng đơn cần người chở | ✏️ Bỏ nút QR header |
| 4 | CreateScreen | Tạo đơn — địa chỉ tự do | ✏️ Thay hub picker bằng AddressSheet |
| 5 | AddressSheet | Bottom sheet nhập địa chỉ tự do | 🆕 Mới hoàn toàn |
| 6 | DetailScreen | Chi tiết đơn (role × status) | ✏️ Bỏ QR actions |
| 7 | RouteFilterScreen | Lọc đơn theo tuyến | ≈ Không đổi |
| 8 | MyOrdersScreen | Lịch sử đơn (3 tab: gửi/chở/nhận) | ≈ Không đổi |
| 9 | LeaderboardScreen | Xếp hạng CO₂ cá nhân + phòng ban | ≈ Không đổi |
| 10 | RankScreen | Podium top 3 | ✏️ Bỏ nút QR header |
| 11 | ProfileScreen | Hồ sơ cá nhân | ✏️ Bỏ nút QR header |
| 12 | EditProfileScreen | Chỉnh sửa thông tin | ≈ Không đổi |
| 13 | SettingsScreen | Cài đặt thông báo | ≈ Không đổi |
| 14 | ReportScreen | Báo sự cố đơn hàng | ≈ Không đổi |

> **Bỏ:** ScanScreen, ShowQrScreen, CamScanScreen (toàn bộ flow QR)

---

## Navigation Flow

```
Tab Bar (HOME VIEW)
├── [Trang chủ]   → HomeScreen
│                    ├── Bell icon → NotificationsScreen
│                    └── click "Giao hàng" → CARRY VIEW (stack)
├── [Hoạt động]  → MyOrdersScreen        ← Tab 2 (đổi chỗ với Xếp hạng)
├── [Xếp hạng]   → LeaderboardScreen     ← Tab 3
└── [Cá nhân]    → ProfileScreen
                      ├── → EditProfileScreen
                      └── → SettingsScreen

CARRY VIEW (no tab bar, FAB "+")
└── BoardScreen
     ├── FAB "+" → CreateScreen
     │              ├── AddressSheet (pickup)
     │              ├── AddressSheet (dropoff)
     │              └── → DetailScreen (replace sau khi tạo)
     ├── card tap → DetailScreen
     │    └── → ReportScreen (báo sự cố)
     └── filter → RouteFilterScreen
```

---

## Data Model

### Hub (backward compat)
```ts
type Hub = {
  id: string;
  name: string;
  shortName: string;
  city: string;
};
```

### Address (mới — địa chỉ tự do)
```ts
type Address = {
  city: string;
  ward?: string;
  street?: string;
  house?: string;
  phone: string;
  name: string;         // tên người nhận/gửi tại địa điểm
  label?: string;       // hiển thị ngắn (auto-generated)
};
```

### Order (updated)
```ts
type Order = {
  id: string;
  from: Hub | Address;  // pickup — hub hoặc địa chỉ tự do
  to: Hub | Address;    // dropoff
  sender: CarryUser;
  receiver: CarryUser | { phone: string; name: string };
  carrier?: CarryUser;
  itemDesc: string;
  size: 'S' | 'M' | 'L';
  value?: number;
  deadline: string;     // ISO datetime
  status: OrderStatus;
  points: number;
  co2Kg: number;
};
```

### Notification (mới)
```ts
type NotifItem = {
  id: string;
  orderId: string;
  type: 'new_order' | 'order_claimed' | 'order_delivered' | 'order_confirmed' | 'order_cancelled';
  title: string;
  body: string;
  createdAt: string;
  seen: boolean;
};
```

---

## Cấu trúc file (target)

```
src/
├── presentation/
│   └── screens/
│       ├── home/         HomeScreen
│       ├── carry/        BoardScreen, CreateScreen, DetailScreen
│       ├── orders/       MyOrdersScreen, RouteFilterScreen, ReportScreen
│       ├── notifications/ NotificationsScreen
│       └── profile/      ProfileScreen, EditProfileScreen, SettingsScreen
├── modules/
│   ├── carry/            CarryService, types (Order, Address, Hub)
│   ├── notification/     NotificationService (buildNotifs, getSeen, setSeen)
│   ├── rank/             RankService
│   └── profile/          ProfileService
└── presentation/
    └── components/
        └── shared/
            ├── AddressSheet.tsx   ← mới
            └── ...
```

---

## Phases

---

## Phase 1 — Foundation & Design Tokens ✅

**Mục tiêu:** SDK infrastructure sẵn sàng, FoxPro tokens theo V2.

- [x] `colors.ts` — FoxPro palette + gradient xanh lá V2 + glassCard token
- [x] `typography.ts` — full scale
- [x] `spacing.ts` — 4px base grid
- [x] `borderRadius.ts`, `shadows.ts`

**Deliverable:** Theme tokens đúng V2. ✅

---

## Phase 2 — HomeScreen V2 & Notifications

**Mục tiêu:** HomeScreen redesign xanh lá + NotificationsScreen mới.

### 2.1 HomeScreen V2
- [ ] Background gradient xanh lá (`#CDEBD2 → #F5F9E8 → #FFF3E0`)
- [ ] Header: avatar + tên + **Bell icon** (badge unread count) — **không có QR button**
- [ ] StatusBar: dark-content khi tab home (nền sáng), light-content khi tab khác
- [ ] **CO₂ Impact Card** — glassmorphism (rgba + blur):
  - **TreesGlyph** SVG (hình cây xanh) thay globe image
  - Tổng CO₂ công ty + cá nhân + km tiết kiệm
  - Animated counter
- [ ] Grid tính năng 3 card:
  - **Giao hàng** — gradient cam đậm (active)
  - **Đón con** — glassmorphism + LockGlyph icon (inactive)
  - **Đi làm chung** — glassmorphism + LockGlyph icon (inactive)

### 2.2 NotificationsScreen (mới)
- [ ] Header "Thông báo" + nút back
- [ ] Danh sách `NotifItem` — title, body, thời gian relative (vừa xong / 2 phút trước...)
- [ ] Unread → background highlight, bold title
- [ ] Tap → đánh dấu seen + navigate đến DetailScreen của orderId
- [ ] Empty state khi chưa có thông báo

### 2.3 NotificationService (update)
- [ ] `buildNotifs(orders, userId)` — generate notif từ danh sách đơn
- [ ] `getSeen()` / `setSeen(id)` — persist trạng thái đã đọc (AsyncStorage)
- [ ] `getUnreadCount(orders, userId)` → number (cho badge)

### 2.4 CO₂ calculator
- [ ] `co2Calculator.ts` — `km × 0.07 kg CO₂e`
- [ ] Format: `< 1kg → "X g"`, `≥ 1kg → "X.X kg"`

**Deliverable:** HomeScreen V2 đúng thiết kế, bell badge hiển thị, vào được NotificationsScreen.

---

## Phase 3 — Carry Board & Tạo đơn V2

**Mục tiêu:** CreateScreen với địa chỉ tự do thay hub cố định.

### 3.1 BoardScreen (update nhỏ)
- [ ] Bỏ nút QR trên header
- [ ] Hiển thị địa chỉ tự do: dùng `placeFromAddr()` để format `city · shortName`
- [ ] FAB "+" cam — navigate CreateScreen

### 3.2 AddressSheet (mới)
Bottom sheet nhập địa chỉ giao hàng tự do:
- [ ] **CityPicker** — dropdown các tỉnh/thành (ưu tiên HCM, HN)
- [ ] **WardInput** — TextInput phường/quận
- [ ] **StreetInput** — TextInput tên đường
- [ ] **HouseInput** — TextInput số nhà
- [ ] **PhoneInput** — TextInput SĐT (format VN: 0xxx)
- [ ] **NameInput** — TextInput tên người tại điểm đó
- [ ] Nút "Xác nhận địa chỉ" → trả về `Address` object
- [ ] Nút "Dùng hub cố định" → fallback sang chọn hub (backward compat)

### 3.3 CreateScreen V2 (rewrite)
- [ ] **Ô "Lấy hàng"** — tap → mở AddressSheet → hiển thị địa chỉ đã chọn
- [ ] **Ô "Giao hàng"** — tap → mở AddressSheet → hiển thị địa chỉ đã chọn
- [ ] TextInput mô tả hàng hóa
- [ ] **SizePicker** — segmented S/M/L
- [ ] TextInput giá trị (format VND, max 500.000đ)
- [ ] **DateInput** — date picker (HTML date input / DateTimePicker)
- [ ] **TimeInput** — time picker tự chọn (không preset cứng)
- [ ] **RewardPreview card** — điểm ước tính + CO₂ ước tính real-time
- [ ] Disclaimer
- [ ] Nút "Đăng đơn" — gradient cam

### 3.4 Data & Service
- [ ] Update `Order` type → `from/to: Hub | Address`
- [ ] `placeFromAddr(addr: Hub | Address): string` — format display ngắn
- [ ] `cityShortSafe(city: string): string` — viết tắt thành phố
- [ ] `CarryService.createOrder()` — chấp nhận Address object

**Deliverable:** Tạo đơn với địa chỉ tự do, hiển thị đúng trên BoardScreen.

---

## Phase 4 — DetailScreen V2

**Mục tiêu:** DetailScreen không còn QR, hiển thị địa chỉ tự do.

### 4.1 Layout update
- [ ] Bỏ nút QR / ShowQr / ScanQr khỏi tất cả ActionBar
- [ ] Card tuyến đường: hiển thị địa chỉ đầy đủ (city · ward · street · house)
- [ ] Card người liên hệ: dùng `u.phone` nếu có, fallback tính từ `mnv`
- [ ] Status timeline: OPEN → CLAIMED → IN_TRANSIT → DELIVERED → CONFIRMED

### 4.2 Action buttons (V2 — không có QR)
| Vai | Trạng thái | Action |
|---|---|---|
| **A** (gửi) | OPEN | Huỷ đơn |
| **A** | CLAIMED | Liên hệ người chở |
| **A** | IN_TRANSIT | Theo dõi |
| **A** | DELIVERED | Xác nhận đã nhận |
| **B** (chở) | OPEN | Nhận chở đơn này |
| **B** | CLAIMED | Đánh dấu đã lấy hàng → IN_TRANSIT |
| **B** | IN_TRANSIT | Đánh dấu đã giao → DELIVERED |
| **C** (nhận) | DELIVERED | Xác nhận đã nhận → CONFIRMED |
| Khác | OPEN | Nhận chở đơn này |

### 4.3 Báo sự cố
- [ ] ReportScreen — grid lý do + textarea
- [ ] Submit → DISPUTED

**Deliverable:** DetailScreen V2 hoạt động không cần QR, địa chỉ tự do hiển thị đúng.

---

## Phase 5 — My Orders, Filter & History

**Mục tiêu:** Quản lý đơn cá nhân (tab 2 của tab bar).

### 5.1 MyOrdersScreen
- [ ] Tab 2 trong tab bar (đổi chỗ với Xếp hạng)
- [ ] Segmented: Tôi gửi / Tôi chở / Tôi nhận
- [ ] Danh sách OrderCard — hiển thị địa chỉ tự do
- [ ] Empty state

### 5.2 RouteFilterScreen
- [ ] RoutePicker (điểm đi, điểm đến) + swap
- [ ] Toggle "Tuyến của tôi"
- [ ] Apply về BoardScreen

**Deliverable:** User quản lý đơn lịch sử, filter theo tuyến.

---

## Phase 6 — Gamification: Điểm, Hạng & Leaderboard

**Mục tiêu:** Hệ thống điểm và xếp hạng (tab 3).

### 6.1 Điểm & Hạng
- [ ] Công thức: base 10 + 1đ/km + size bonus (S:0, M:+5, L:+10)
- [ ] Hạng: Đồng / Bạc / Vàng / Bạch kim
- [ ] Badge + progress bar

### 6.2 LeaderboardScreen
- [ ] Hero card: CO₂ công ty + cá nhân
- [ ] Top cá nhân (huy chương) + theo phòng ban

### 6.3 RankScreen
- [ ] Podium 3 bậc, danh sách từ #4
- [ ] Bỏ nút QR trên header

**Deliverable:** Gamification loop đầy đủ.

---

## Phase 7 — Profile & Settings

**Mục tiêu:** Hồ sơ cá nhân (tab 4).

### 7.1 ProfileScreen
- [ ] Avatar + tên + phòng ban + MNV
- [ ] Badge hạng + stats grid + progress bar
- [ ] Card tuyến mặc định
- [ ] Menu: Chỉnh sửa / Lịch sử / Cài đặt
- [ ] Bỏ nút QR trên header

### 7.2 EditProfileScreen
- [ ] Form: tên, hub mặc định, tuyến thường đi
- [ ] Color picker avatar

### 7.3 SettingsScreen
- [ ] Toggle thông báo (đơn mới / đơn của tôi)
- [ ] Phiên bản app

**Deliverable:** Profile đầy đủ.

---

## Phase 8 — Polish & Production

**Mục tiêu:** App production-ready.

### 8.1 Animations & micro-interactions
- [ ] Skeleton loading danh sách đơn
- [ ] Animated CO₂ counter
- [ ] Confetti khi CONFIRMED
- [ ] Haptic feedback
- [ ] Bell badge animate khi có thông báo mới

### 8.2 Error handling
- [ ] Offline banner
- [ ] Retry logic
- [ ] Đơn đã bị nhận khi user click → toast + refresh

### 8.3 Notification polish
- [ ] Badge count live update khi navigate về home
- [ ] Tap notif → navigate đúng DetailScreen
- [ ] Mark all as read

### 8.4 Accessibility & Performance
- [ ] Touch target ≥ 44px
- [ ] FlatList optimization
- [ ] VoiceOver labels

**Deliverable:** App shipper-ready.

---

## Tracking

| Phase | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | Foundation & Tokens | ✅ Xong | Theme V2 cần gradient xanh lá |
| 2 | HomeScreen V2 + Notifications | ⬜ Chưa bắt đầu | Redesign lớn, thêm NotificationsScreen |
| 3 | Carry Board & CreateScreen V2 | ⬜ Chưa bắt đầu | AddressSheet mới |
| 4 | DetailScreen V2 | ⬜ Chưa bắt đầu | Bỏ QR, địa chỉ tự do |
| 5 | My Orders & Filter | ⬜ Chưa bắt đầu | Tab order đổi |
| 6 | Gamification | ⬜ Chưa bắt đầu | |
| 7 | Profile & Settings | ⬜ Chưa bắt đầu | |
| 8 | Polish & Production | ⬜ Chưa bắt đầu | Bell badge polish |

---

## Quyết định kỹ thuật

| Vấn đề | Quyết định | Lý do |
|---|---|---|
| QR verification | **Bỏ** (V2) | V2 không có flow QR |
| Địa chỉ pickup/dropoff | Address object tự do | Không giới hạn hub nội bộ |
| Notification persist | AsyncStorage `seen` set | Không cần server, nhanh |
| Navigation | SDK's `Navigator` + Modal overlay | Đã có sẵn |
| State management | `useState` / `useReducer` per screen | Scale nhỏ, không cần Redux |
| Date/time picker | `@react-native-community/datetimepicker` | Đã có trong package_fox_pro.json |
| Backward compat | `from: Hub \| Address` union type | Giữ mock data cũ chạy được |

---

*Cập nhật lần cuối: 2026-06-29 — dựa trên Fox_Eco_V2.html*
