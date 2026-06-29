# Phase 5 — QR Verification

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Mục tiêu

Luồng xác nhận bàn giao an toàn bằng mã QR 6 số giữa 3 bên.

---

## Thay đổi

| File | Loại | Mô tả |
|---|---|---|
| `src/modules/qr/QrService.ts` | Mới | Generate/validate mã 6 số OTP, TTL 5 phút, one-time use |
| `src/modules/qr/index.ts` | Mới | Barrel export |
| `screens/qr/QrMatrix.tsx` | Mới | Dot-matrix QR visual (21×21, deterministic từ code seed) |
| `screens/qr/ShowQrScreen.tsx` | Mới | Hiển thị QR + 6 ô số + countdown timer + auto-refresh |
| `screens/qr/ScanScreen.tsx` | Mới | Dark theme, scanline animation, fallback nhập tay 6 số |
| `screens/qr/index.ts` | Mới | Barrel export |
| `example/SDKComponents.js` | Sửa | 2 demo: ShowQrScreen pickup, ScanScreen pickup |

---

## Thiết kế chi tiết

### QrService
```
generateCode(orderId, type) → 6 số ngẫu nhiên, lưu vào Map với TTL 5 phút
validateCode(orderId, type, input) → 'ok' | 'wrong' | 'expired' | 'used'
isExpired(orderId, type) → boolean
getRemainingSeconds(orderId, type) → number
```
Key store: `${orderId}:${type}` — mỗi đơn có 2 mã riêng (pickup + dropoff).

### QrMatrix algorithm
- Ma trận 21×21 boolean, deterministic từ seed = parseInt(code)
- LCG random: `seed = (seed * 1664525 + 1013904223) & 0xffffffff`
- Finder patterns 3 góc cố định (giống QR ISO, visual only)
- Data cells fill theo seed > 0.45
- Render bằng `View` absolute positioning — không cần SVG hay lib ngoài

### ShowQrScreen
```
- code = QrService.generateCode() khi mount
- setInterval 1s → countdown → khi hết → auto generateCode()
- Timer đỏ khi còn ≤ 60s + nút "Làm mới mã" xuất hiện
- 6 ô số tách biệt, letter-spacing rộng
- 2 context: pickup (📦) / dropoff (✅)
```

### ScanScreen
```
- mode: 'camera' | 'manual'
- Camera mode: frame 240×240, 4 góc cam, scanline Animated.loop
- Manual mode: 6 ô số ảo (View) + hidden TextInput, auto-submit khi đủ 6 số
- validate() → setResult → 'ok': 800ms delay → onSuccess()
- 'wrong/expired/used': hiện thông báo + nút "Thử lại"
```

---

## Quyết định kỹ thuật

- **QrMatrix không chuẩn ISO** — chỉ dùng visual. Camera scan thực tế cần `react-native-vision-camera` + decoder (Phase sau khi có native module).
- **Hidden TextInput** trong manual mode — một TextInput ẩn nhận input, 6 View hiển thị digits. Tránh cần custom keyboard.
- **`inset` CSS không hỗ trợ RN 0.65** — thay bằng `top/left/right/bottom: 0` (fix TypeScript error).
- **OTP store in-memory** — đủ cho single-device demo. Production cần server-side validation để tránh replay attack.
