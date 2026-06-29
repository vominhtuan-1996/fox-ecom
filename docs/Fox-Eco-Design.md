# Fox-Eco Design Specification
### FTel Carry — Design Language & UI/UX Guidelines

---

| Trường | Thông tin |
|---|---|
| **Ngày** | 29/06/2026 |
| **Phiên bản** | v1.0 |
| **Nguồn gốc** | Trích xuất từ Fox Eco_edit26062026.html (Framer Prototype) |
| **Design System** | Fox Pro — Design System (Figma: Fox Pro - Design System.fig) |
| **Audience** | Frontend Dev, Mobile Dev, UI/UX Designer |

---

## 1. Brand & Visual Identity

### 1.1. Tên & Nhãn Hiệu

| Layer | Tên | Ghi chú |
|---|---|---|
| Hệ thống (backend) | **FoxEco** | Tên dùng trong code, DB, API |
| App người dùng | **FTel Carry** | Tên hiển thị trên store / splash screen |
| Tagline | **Tiện đường** | Slogan ngắn, dùng trong onboarding & marketing |
| Tên cũ | FoxEco / FTel Carry | Dùng song song tùy context |

### 1.2. Logo

```
[SVG Logo]
viewBox: 0 0 100 100
Background: Rounded square, rx=22, fill=#FF8500
Icon: Delivery cart/truck, stroke=#FFFFFF, stroke-width=3
  - 2 wheels (circles): cx=34,cy=64,r=8 và cx=68,cy=64,r=8
  - Cart body path: M54 30h8l6 18 / M34 64 41 40h18l-7 24 / M41 40 37 30h-6
```

**Nguyên tắc logo:**
- Luôn dùng nền cam (#FF8500) cho icon trên nền sáng.
- Icon màu trắng (#FFFFFF) trên nền cam.
- Không dùng logo trên nền tối chưa có dark mode spec.
- Minimum size: 32×32px (mobile), 48×48px (web).

---

## 2. Color System

### 2.1. Primary Colors

| Token | Hex | RGB | Dùng cho |
|---|---|---|---|
| `primary-500` | `#FF8500` | 255, 133, 0 | CTA chính, brand color, logo background |
| `primary-600` | `#FFA800` | 255, 168, 0 | Hover / pressed state của button primary |
| `primary-100` | `#FFF1E6` | 255, 241, 230 | Background highlight, badge light |
| `primary-400` | `#FF8A00` | 255, 138, 0 | Icon active, link visited |

### 2.2. Accent / Secondary Colors

| Token | Hex | RGB | Dùng cho |
|---|---|---|---|
| `accent-500` | `#284EEB` | 40, 78, 235 | Secondary CTA, link |
| `accent-600` | `#5933EB` | 89, 51, 235 | Active state accent |
| `accent-400` | `#6E4BFF` | 110, 75, 255 | Badge, highlight accent |
| `accent-deep` | `#2E008E` | 46, 0, 142 | Text accent trên nền sáng |

### 2.3. Semantic Colors

| Token | Hex | Semantic | Dùng cho |
|---|---|---|---|
| `success-500` | `#0BD78C` | Success/Green | Trạng thái thành công, delivered, completed |
| `info-500` | `#16ADFF` | Info/Blue | Thông báo info, tracking active |
| `error-500` | `#F43F4A` | Error/Red | Lỗi, cảnh báo, hủy đơn |
| `warning-500` | `#FFC24D` | Warning/Yellow | Cảnh báo nhẹ, timeout sắp đến |

### 2.4. Neutral / Grayscale

| Token | Hex | Dùng cho |
|---|---|---|
| `text-900` | `#111C36` | Body text chính, heading |
| `text-700` | `#3C4459` | Secondary text, subtitle |
| `text-500` | `#666D7C` | Label, caption, placeholder active |
| `text-300` | `#A0A4AF` | Placeholder, disabled text |
| `border-300` | `#CFD2D7` | Border mặc định |
| `border-200` | `#E7E9EE` | Divider nhẹ |
| `border-100` | `#ECEDEF` | Separator, subtle divider |
| `surface-200` | `#F6F6F6` | Card background |
| `surface-100` | `#FAFAFB` | Surface nhẹ hơn |
| `background` | `#faf9f5` | App background (warm off-white) |
| `white` | `#FFFFFF` | Component background, modal |

### 2.5. Usage Guidelines

```
Button Primary:      bg=#FF8500, text=#FFFFFF, hover-bg=#FFA800
Button Secondary:    bg=#FFF1E6, text=#FF8500, border=#FF8500
Button Destructive:  bg=#F43F4A, text=#FFFFFF
Button Disabled:     bg=#ECEDEF, text=#A0A4AF

Status Badge Delivered:   bg=#0BD78C (light tint), text=#0BD78C
Status Badge In Transit:  bg=#16ADFF (light tint), text=#284EEB
Status Badge Error:       bg=#F43F4A (light tint), text=#F43F4A
Status Badge Pending:     bg=#FFF1E6, text=#FF8500

Card background:     #FFFFFF hoặc #FAFAFB
App background:      #faf9f5
```

---

## 3. Typography

### 3.1. Font Stack

```css
font-family: "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

**Ưu tiên:** Helvetica Neue → System font (iOS: SF Pro, Android: Roboto).

### 3.2. Type Scale

| Role | Size | Weight | Line Height | Dùng cho |
|---|---|---|---|---|
| `display` | 28px | 700 | 36px | Heading màn hình chính |
| `heading-1` | 24px | 700 | 32px | Section title |
| `heading-2` | 20px | 600 | 28px | Card title, modal title |
| `heading-3` | 18px | 600 | 24px | Sub-heading |
| `body-large` | 16px | 400 | 24px | Body text chính |
| `body` | 14px | 400 | 20px | Text thông thường |
| `body-medium` | 14px | 500 | 20px | Label, caption quan trọng |
| `caption` | 12px | 400 | 16px | Meta info, timestamp |
| `overline` | 11px | 600 | 16px | Label nhỏ uppercase |

### 3.3. Nguyên tắc Typography

- Minimum text size trên mobile: **14px** (body), **12px** (caption).
- Primary text color: `#111C36`.
- Không dùng font-weight dưới 400 cho body.
- Vietnamese text cần line-height đủ rộng (≥ 1.4×) vì diacritics.

---

## 4. Spacing & Layout

### 4.1. Spacing Scale (Base 4px)

| Token | Value | Dùng cho |
|---|---|---|
| `space-1` | 4px | Gap nhỏ nhất, icon padding |
| `space-2` | 8px | Compact spacing |
| `space-3` | 12px | Item padding nội |
| `space-4` | 16px | Standard padding |
| `space-5` | 20px | Section spacing |
| `space-6` | 24px | Large spacing |
| `space-8` | 32px | Section gap lớn |
| `space-10` | 40px | Header height, large gap |

### 4.2. Border Radius

| Token | Value | Dùng cho |
|---|---|---|
| `radius-sm` | 8px | Tag, badge, input |
| `radius-md` | 12px | Card, button |
| `radius-lg` | 16px | Bottom sheet, modal |
| `radius-xl` | 22px | Logo container, full-rounded card |
| `radius-full` | 9999px | Avatar, pill button |

### 4.3. Touch Targets

- Minimum touch target: **44×44px** (iOS HIG standard).
- Recommended: **48×48px** cho button chính.

---

## 5. Navigation Structure

### 5.1. Bottom Tab Navigation (App Mobile)

Áp dụng cho cả app **Người gửi** và **CBNV**:

```
┌─────────────────────────────────────────────┐
│                  Content Area               │
│                                             │
├──────────┬──────────┬──────────┬────────────┤
│ Trang chủ│ Hoạt động│ Xếp hạng │  Cá nhân  │
│  (Home)  │(Activity)│(Rankings)│ (Profile)  │
└──────────┴──────────┴──────────┴────────────┘
```

| Tab | Icon | Mô tả |
|---|---|---|
| **Trang chủ** | Home/house icon | Feed đơn mới, shortcut tạo đơn, trạng thái đơn active |
| **Hoạt động** | Activity/list icon | Lịch sử đơn của tôi (gửi + nhận + chở) |
| **Xếp hạng** | Trophy/star icon | Leaderboard cá nhân + theo phòng |
| **Cá nhân** | Avatar/user icon | Profile, tier, settings, rewards |

### 5.2. Admin Web Navigation

```
Sidebar (left):
├── Dashboard (tổng quan)
├── Đơn hàng
│   ├── Tất cả đơn
│   ├── Đang hoạt động
│   └── Sự cố
├── Người dùng
│   ├── Danh sách CBNV
│   └── Cấu hình tier
├── Cấu hình hệ thống
│   ├── FPT Office Presets
│   ├── Phí & Matching Rules
│   └── Rewards Catalog
└── Logs & Audit
```

---

## 6. Screen Inventory

### 6.1. App Người Gửi (Sender)

| Screen | Route | Mô tả |
|---|---|---|
| Splash / Onboarding | `/splash` | Logo animation, tagline "Tiện đường" |
| Đăng nhập | `/login` | SSO FPT hoặc auth form |
| Trang chủ | `/home` | Service picker (3 loại), đơn active, feed |
| Tạo đơn — Bước 1 | `/order/create/info` | Mô tả hàng, ảnh, loại hàng, giá trị |
| Tạo đơn — Bước 2 | `/order/create/address` | Pickup/dropoff: presets, autocomplete, map |
| Tạo đơn — Bước 3 | `/order/create/confirm` | Xem quote phí, xác nhận |
| Đơn hàng của tôi | `/orders` | Danh sách đơn theo tab: Active, Lịch sử |
| Chi tiết đơn | `/order/:id` | Timeline, map, proof ảnh, CBNV info |
| Xác nhận giao hàng | `/order/:id/confirm-delivery` | Receiver bấm "Xác nhận đã nhận" |
| Báo sự cố | `/order/:id/incident` | Form reason, description, ảnh |
| Đánh giá | `/order/:id/rating` | Star rating + comment |
| Hồ sơ | `/profile` | Info cá nhân, tier, stats |
| Chỉnh sửa hồ sơ | `/profile/edit` | Tên, SĐT, avatar, phòng ban |
| Lịch sử đơn | `/profile/orders` | Toàn bộ lịch sử đơn đã gửi |
| Đổi thưởng | `/profile/rewards` | Catalog + đổi bằng điểm |
| Cài đặt | `/profile/settings` | Notifications, privacy, logout |
| Xếp hạng | `/rankings` | Tab: Cá nhân / Theo phòng |
| Thông báo | `/notifications` | In-app notification list |

### 6.2. App Người Giao (Carrier / CBNV)

| Screen | Route | Mô tả |
|---|---|---|
| Trang chủ (Carrier) | `/home` | Đơn phù hợp, toggle trạng thái nhận đơn |
| Đơn phù hợp | `/orders/available` | Card list: đơn có thể nhận |
| Chi tiết đơn (trước khi nhận) | `/order/:id/preview` | Thông tin đơn, khoảng lệch tuyến, phí |
| Đơn đang nhận | `/order/:id/active` | Flow pickup hoặc delivery |
| Pickup Flow — Step 1 | `/order/:id/pickup/arrive` | Bấm "Đã đến điểm lấy hàng", xem info người gửi + SĐT |
| Pickup Flow — Step 2 | `/order/:id/pickup/photo` | Chụp ảnh hàng hóa (bắt buộc) |
| Pickup Flow — Step 3 | `/order/:id/pickup/confirm` | Bấm "Đã nhận hàng, bắt đầu giao" |
| GPS Tracking (passive) | Chạy nền | Gửi location points, không có UI riêng |
| Delivery Flow — Step 1 | `/order/:id/delivery/arrive` | Bấm "Đã đến điểm giao", xem info người nhận + SĐT |
| Delivery Flow — Step 2 | `/order/:id/delivery/confirm` | Bấm "Đã giao hàng" + tùy chọn chụp ảnh |
| Lộ trình của tôi | `/route` | Khai báo, chỉnh sửa lộ trình thường đi |
| Preferences | `/route/preferences` | Max detour, max weight, loại hàng |

### 6.3. Admin Web Portal

| Screen | Mô tả |
|---|---|
| Dashboard | Số đơn theo status, KPIs tổng quan, alert incidents |
| Danh sách đơn | Table với filter: status, time, sender, carrier, service type, incident |
| Chi tiết đơn | Timeline, proof ảnh, GPS map, assignment info, payment |
| Xử lý incident | Queue sự cố, form processing/resolve/reject |
| Quản lý user | Danh sách CBNV, filter, xem profile, lock/unlock |
| Cấu hình hệ thống | Matching rules, fee config, GPS intervals |
| Audit Log | Lịch sử hành động admin |

---

## 7. Key UI Components

### 7.1. Order Card (Carrier View)

```
┌─────────────────────────────────────────────┐
│ [Icon] Giao hàng              [Phí] 25.000đ │
│ ─────────────────────────────────────────── │
│ 📍 Từ: FPT Tân Thuận                        │
│ 🏁 Đến: 29 Cống Quỳnh, Q1                  │
│ ─────────────────────────────────────────── │
│ 📦 ~500g  ⏱ 08:30–10:00  📏 +1.2km lệch    │
│                                             │
│         [Từ chối]    [Nhận đơn →]           │
└─────────────────────────────────────────────┘
```

**Specs:**
- Background: `#FFFFFF`, border-radius: 12px
- Shadow: `0 2px 8px rgba(17, 28, 54, 0.08)`
- Primary CTA: `#FF8500`, border-radius: 24px (pill)
- Secondary: outlined, `#FF8500` border + text

### 7.2. Status Timeline

```
● HOÀN TẤT                    14:32
│
● ĐÃ TRAO                     14:15
│
● ĐANG GIAO          Nguyễn V A
│
● CÓ NGƯỜI CHỞ               09:45
│
● ĐĂNG ĐƠN                   09:30
```

**Specs:**
- Dot active: `#FF8500`, size 12px
- Dot completed: `#0BD78C`, size 12px
- Dot pending: `#CFD2D7`, size 8px
- Line: 2px, color `#E7E9EE`

### 7.3. Pickup Flow Steps (Carrier — 3 bước)

> Không có QR/OTP. Xác thực qua ảnh chụp hàng hóa + xác nhận trong app.

```
Step 1/3: ĐẾN ĐIỂM LẤY HÀNG
┌────────────────────────────────────────────┐
│  📍 FPT Tân Thuận                          │
│  Lô B3, E-Office, KCN Tân Thuận, Q7       │
│                                            │
│  👤 Nguyễn Thị B                          │
│  ☎️  0912 345 678   [Gọi ngay]            │
│  💬  Ghi chú: Để ở lễ tân tầng 1          │
│                                            │
│  [Mở bản đồ chỉ đường]                   │
│                                            │
│         [Tôi đã đến nơi →]               │
└────────────────────────────────────────────┘

Step 2/3: CHỤP ẢNH HÀNG HÓA
┌────────────────────────────────────────────┐
│  Chụp ảnh hàng trước khi mang đi          │
│  (Ảnh này là bằng chứng tình trạng hàng)  │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │          [Camera View]             │   │
│  └────────────────────────────────────┘   │
│                                            │
│  [📷 Chụp ảnh]      [Thư viện]           │
│                                            │
│  ✅ Ảnh đã chụp — [Xem lại] [Chụp lại]   │
│                                            │
│         [Tiếp theo →]                     │
└────────────────────────────────────────────┘

Step 3/3: XÁC NHẬN ĐÃ NHẬN HÀNG
┌────────────────────────────────────────────┐
│  Bạn đã nhận hàng từ Nguyễn Thị B         │
│                                            │
│  📦 Mô tả: Tài liệu A4, 1 xấp            │
│  📍 Giao đến: 29 Cống Quỳnh, Q1          │
│                                            │
│  ─────────────────────────────────────    │
│  Bấm xác nhận để bắt đầu giao hàng.       │
│  GPS tracking sẽ tự động bật.             │
│                                            │
│    [Báo sự cố]   [Đã nhận, bắt đầu giao] │
└────────────────────────────────────────────┘
```

### 7.4. Delivery Flow Steps (Carrier + Receiver — 2+1 bước)

```
[CARRIER] Step 1/2: ĐẾN ĐIỂM GIAO
┌────────────────────────────────────────────┐
│  📍 29 Cống Quỳnh, P. Bến Thành, Q1       │
│                                            │
│  👤 Trần Văn C (Người nhận)               │
│  ☎️  0987 654 321   [Gọi ngay]            │
│  💬  Ghi chú: Để ở bàn tiếp tân           │
│                                            │
│  [Mở bản đồ chỉ đường]                   │
│                                            │
│         [Tôi đã đến nơi →]               │
└────────────────────────────────────────────┘
  → Hệ thống tự notify Trần Văn C: "Hàng sắp đến"

[CARRIER] Step 2/2: XÁC NHẬN ĐÃ GIAO
┌────────────────────────────────────────────┐
│  Bạn đã trao hàng cho Trần Văn C?         │
│                                            │
│  📷 Chụp ảnh tại điểm giao (tùy chọn)    │
│  ┌────────────────────────────────────┐   │
│  │  [+ Thêm ảnh xác nhận]            │   │
│  └────────────────────────────────────┘   │
│                                            │
│    [Báo sự cố]       [Đã giao hàng ✓]    │
└────────────────────────────────────────────┘

[RECEIVER] Xác nhận đã nhận:
┌────────────────────────────────────────────┐
│  🔔 Đơn #FTC-20260629-001                 │
│  CBNV Nguyễn Văn A vừa báo đã giao hàng   │
│                                            │
│  Bạn đã nhận được hàng chưa?              │
│                                            │
│  [Xem ảnh hàng khi lấy]                  │
│                                            │
│  [Chưa nhận — Báo sự cố]                 │
│  [Đã nhận hàng ✓]                        │
└────────────────────────────────────────────┘
```

### 7.5. GPS Tracking Map (Sender View)

```
┌────────────────────────────────────────────┐
│  [MAP VIEW — Google Maps]                  │
│                                            │
│  📍 Pickup point                          │
│  🏁 Dropoff point                         │
│  🚴 CBNV hiện tại (live dot #FF8500)      │
│                                            │
│  ─────────────────────────────────────    │
│  🚴 Nguyễn Văn A                          │
│  Cập nhật: vừa xong                       │
│  📞 Gọi   💬 Nhắn tin                    │
└────────────────────────────────────────────┘
```

### 7.6. Profile Screen

```
┌────────────────────────────────────────────┐
│  [Avatar]  Nguyễn Văn A     [Bạch kim 👑] │
│  Kỹ thuật HTKT · FPT Telecom              │
│                                            │
│  ⭐ 4.8  |  52 đơn  |  12.4 kg CO₂      │
│  ─────────────────────────────────────    │
│  💎 1.250 điểm thưởng                     │
│  ──────────────────────────────────────   │
│  📋 Chỉnh sửa thông tin                   │
│  📦 Lịch sử đơn của tôi                   │
│  🎁 Đổi thưởng                            │
│  ⚙️  Cài đặt                              │
│  📄 Điều khoản sử dụng                    │
└────────────────────────────────────────────┘
```

### 7.7. Leaderboard (Xếp hạng)

```
Tab: [Cá nhân] [Theo phòng]

┌────────────────────────────────────────────┐
│  🏆 Tháng 6/2026                           │
│  ─────────────────────────────────────    │
│  #1  Trần Thị C    Hạ tầng    1.850 đ   │
│  #2  Lê Văn D      Nhân sự    1.640 đ   │
│  #3  Nguyễn A      HTKT       1.250 đ   │
│  ─────────────────────────────────────    │
│  ... (top 50)                             │
│                                            │
│  Vị trí của bạn: #3 · 1.250 điểm         │
└────────────────────────────────────────────┘
```

---

## 8. Status Labels & UI Copy (Vietnamese)

### 8.1. Status Labels

| Status Code | Label UI | Color |
|---|---|---|
| `DRAFT` | Bản nháp | `#A0A4AF` |
| `POSTED` | Đăng đơn | `#FF8500` |
| `BROADCASTING` | Đang tìm người chở | `#FFA800` |
| `ASSIGNED` | Có người chở | `#284EEB` |
| `PICKED_UP` / `IN_TRANSIT` | Đang giao | `#16ADFF` |
| `DELIVERED` | Đã trao | `#0BD78C` |
| `COMPLETED` | Hoàn tất | `#0BD78C` |
| `INCIDENT` | Đang xử lý sự cố | `#F43F4A` |
| `CANCELLED` | Đã hủy | `#A0A4AF` |
| `EXPIRED` | Hết hạn | `#CFD2D7` |
| `FAILED` | Giao thất bại | `#F43F4A` |

### 8.2. Status Messages (Feed Copy)

| Context | Copy |
|---|---|
| Đơn đang chờ | "Đơn của bạn đã lên bảng, chờ đồng nghiệp thuận đường nhận chở." |
| Có người chở (Sender) | "[Tên CBNV] sẽ đến lấy hàng. Giữ liên lạc qua điện thoại nhé." |
| Có người chở (Carrier) | "Hãy đến gặp người gửi để lấy hàng." |
| Đang giao (Sender) | "Hàng đang trên đường tới người nhận." |
| Đang giao (Carrier) | "Bạn đang giao đơn này. Đến nơi nhớ bấm xác nhận." |
| Đang giao (Receiver) | "Hàng đang trên đường tới bạn." |
| Hoàn tất (Sender) | "Đơn của bạn đã được giao thành công." |
| Hoàn tất (Receiver) | "Bạn đã nhận hàng thành công." |
| Incident | "Bộ phận hỗ trợ đang xem xét đơn này." |

### 8.3. CO₂ Copy

| Context | Template |
|---|---|
| Sau khi đơn hoàn tất | "Bạn đã tiết kiệm [X] kg CO₂ cho chuyến này." |
| Trong feed | "[Tên đơn] đã hoàn tất · Tiết kiệm [X] kg CO₂." |
| Profile tổng | "Tổng CO₂ tiết kiệm: [X] kg" |

### 8.4. Gamification Copy

| Context | Copy |
|---|---|
| Cộng điểm | "🎉 Bạn vừa nhận được [X] điểm thưởng!" |
| Lên tier | "🏆 Chúc mừng! Bạn đã đạt cấp [Tier Name]." |
| Đổi thưởng | "Đổi thưởng thành công. [Reward name] đã được ghi nhận." |

### 8.5. Notification Templates

| Type | Title | Body |
|---|---|---|
| Broadcast | "Có đơn phù hợp!" | "Giao hàng từ [pickup] → [dropoff]. Phí [X]đ. Nhận ngay!" |
| Assigned | "Đã có người chở" | "[Tên CBNV] sẽ đến lấy hàng của bạn." |
| Pickup done | "Hàng đang trên đường" | "[Tên CBNV] đã lấy hàng, đang giao đến bạn." |
| Delivered | "Đơn đã hoàn tất" | "Hàng đã được giao thành công." |
| Incident | "Có sự cố đơn hàng" | "Đơn #[code] đang có sự cố. Chúng tôi đang xử lý." |
| Reward | "Bạn nhận được điểm thưởng!" | "Đơn hoàn tất, +[X] điểm đã được cộng." |

---

## 9. FPT Office Presets

Dùng trong **form tạo đơn** và **khai báo lộ trình CBNV** để giảm thời gian nhập địa chỉ.

### 9.1. Danh Sách Presets

| Preset Key | Tên hiển thị | Địa chỉ đầy đủ | Lat | Lng |
|---|---|---|---|---|
| `HCM_TAN_THUAN` | FPT Tân Thuận | Lô B3, E-Office, KCN Tân Thuận, P. Tân Thuận, Q7, HCM | 10.7348 | 106.7163 |
| `HCM_Q1` | FPT Quận 1 | 29 Cống Quỳnh, P. Bến Thành, Q1, HCM | 10.7757 | 106.6920 |
| `HCM_TAN_BINH` | FPT Tân Bình | 391A Nam Kỳ Khởi Nghĩa, P. 14, Q. Tân Bình, HCM | 10.8001 | 106.6657 |
| `HCM_THU_DUC` | FPT Thủ Đức | Lô E2a-7, Đường D1, Khu CNC, P. Long Thạnh Mỹ, Thủ Đức | 10.8412 | 106.8108 |
| `HCM_PHU_MY_HUNG` | FPT Phú Mỹ Hưng | Crescent Plaza, 105 Tôn Dật Tiên, P. Tân Phú, Q7, HCM | 10.7278 | 106.7012 |
| `HN_CAU_GIAY` | FPT Cầu Giấy | 17 Duy Tân, P. Dịch Vọng Hậu, Cầu Giấy, Hà Nội | 21.0285 | 105.7979 |

> **Lưu ý:** Tọa độ là ước tính, cần verify với Google Maps API trước khi đưa vào production.

### 9.2. Hiển thị trong Form

```
Điểm lấy hàng
─────────────────────────────────────────────
📍 [Quick select: văn phòng FPT]
   ┌──────────────┐ ┌──────────────┐
   │ FPT Tân Thuận│ │  FPT Q1      │
   └──────────────┘ └──────────────┘
   ┌──────────────┐ ┌──────────────┐
   │ FPT Tân Bình │ │ FPT Thủ Đức  │
   └──────────────┘ └──────────────┘
   [Xem thêm...]

── hoặc nhập tay ──
🔍 Tìm địa chỉ...
🗺️  Chọn trên bản đồ
```

---

## 10. Gamification & Tier System

### 10.1. Tier Structure

| Tier | Tên | Điểm cần | Badge Color | Quyền lợi |
|---|---|---|---|---|
| Bronze | Đồng | 0–499 | `#A0A4AF` | Cơ bản |
| Silver | Bạc | 500–1.499 | `#CFD2D7` | Ưu tiên broadcast |
| Gold | Vàng | 1.500–4.999 | `#FFC24D` | Bonus điểm +10% |
| Platinum | Bạch kim | 5.000+ | `#284EEB` | Bonus điểm +25%, ưu tiên cao nhất |

> Tier tính theo **tổng điểm lũy kế** (không reset).

### 10.2. Điểm Thưởng

| Hành động | Điểm nhận |
|---|---|
| Hoàn thành đơn giao hàng | +10 điểm/đơn (admin cấu hình) |
| Rating 5 sao từ sender | +5 điểm bonus |
| Streak: 5 đơn liên tiếp | +25 điểm bonus |
| Hủy sau khi nhận đơn | -10 điểm |
| Incident do lỗi CBNV | -20 điểm |

### 10.3. Leaderboard

| Loại | Scope | Reset | Hiển thị |
|---|---|---|---|
| Cá nhân | Cá nhân | Hàng tháng | Top 50, vị trí của bạn |
| Theo phòng | Phòng ban | Hàng tháng | Top 20 phòng, tổng điểm + CO₂ |

---

## 11. CO₂ Calculation

### 11.1. Công thức

```
CO₂_saved (kg) = distance_km × emission_factor

Trong đó:
  distance_km   = khoảng cách route pickup → dropoff (từ Google Maps)
  emission_factor = hệ số phát thải (mặc định: 0.21 kg CO₂/km/xe)
                    admin có thể cấu hình
```

### 11.2. Nguyên tắc

- CO₂ chỉ tính khi đơn COMPLETED, không tính khi hủy/failed.
- Giá trị min = 0 (không hiển thị số âm).
- Label "ước tính" rõ ràng — không có giá trị pháp lý trong MVP.
- Lưu vào order record sau khi COMPLETED.

---

## 12. Design Checklist cho Dev

### 12.1. Mobile App

- [ ] Font: Helvetica Neue / system font stack
- [ ] Background app: `#faf9f5` (warm off-white)
- [ ] Primary CTA button: `#FF8500`, border-radius 24px
- [ ] Bottom tab: 4 tabs (Trang chủ, Hoạt động, Xếp hạng, Cá nhân)
- [ ] Touch target tối thiểu: 44×44px
- [ ] Vietnamese line-height: ≥ 1.4×
- [ ] Status badge: đúng màu per status table
- [ ] Pickup flow: 3 bước (đến nơi → chụp ảnh → xác nhận nhận hàng), không có OTP
- [ ] Delivery flow: CBNV bấm "Đã giao" → Receiver bấm "Xác nhận đã nhận"
- [ ] Camera/photo UI: preview, retake, upload progress indicator
- [ ] GPS map: Google Maps SDK, pin màu `#FF8500`
- [ ] FPT office presets: quick-select chips trong form địa chỉ

### 12.2. Admin Web

- [ ] Sidebar navigation
- [ ] Data table: sort, filter, pagination
- [ ] Map view trong order detail
- [ ] Force action: modal confirm + reason input
- [ ] Audit log: read-only table

### 12.3. Design Tokens

Tất cả màu sắc, spacing, radius phải đi từ design tokens, không hardcode giá trị.  
Tham khảo: **Fox Pro - Design System.fig** (Figma file nội bộ).

---

*Tài liệu được trích xuất và tổng hợp từ: Fox Eco_edit26062026.html (Framer Prototype)*  
*Phiên bản: v1.1 | Ngày: 29/06/2026 | Cập nhật: Bỏ QR/OTP, thay bằng luồng xác nhận 2 chiều trong app + proof photo*
