# Phase 4 — DetailScreen

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Mục tiêu

Màn hình chi tiết đơn hàng thích nghi hoàn toàn theo **vai trò × trạng thái**, action buttons tự động đúng context.

---

## Thay đổi

| File | Loại | Mô tả |
|---|---|---|
| `screens/carry/detail/StatusTimeline.tsx` | Mới | Timeline 5 bước OPEN→CONFIRMED, active pulse, connector filled |
| `screens/carry/detail/PartyCard.tsx` | Mới | 3 party (gửi/chở/nhận), highlight carrier, nút liên hệ 💬 |
| `screens/carry/detail/ActionBar.tsx` | Mới | Logic action theo role × status, sticky bottom |
| `screens/carry/detail/DetailScreen.tsx` | Mới | Layout tổng hợp: header, timeline, route, hàng hóa, party, action |
| `screens/carry/detail/index.ts` | Mới | Barrel export |
| `screens/carry/index.ts` | Sửa | Re-export `./detail` |
| `example/SDKComponents.js` | Sửa | 3 demo: sender/CLAIMED, carrier/IN_TRANSIT, CONFIRMED |

---

## ActionBar matrix

| Vai trò | Trạng thái | Button |
|---|---|---|
| **sender** | OPEN | Huỷ đơn (danger) |
| **sender** | CLAIMED | Hiện mã QR giao hàng (primary) |
| **sender** | IN_TRANSIT | Đang giao — theo dõi (outline, disabled) |
| **sender** | DELIVERED | Hiện mã xác nhận nhận (primary) |
| **sender** | CONFIRMED | — (không có action) |
| **carrier** | CLAIMED | Quét mã người gửi (primary) |
| **carrier** | IN_TRANSIT | Quét mã người nhận + Báo sự cố |
| **carrier** | CONFIRMED | — |
| **receiver** | DELIVERED | Hiện mã xác nhận (primary) |
| **receiver** | CONFIRMED | — |
| **other** | OPEN | Nhận chở đơn này (primary) |
| **other** | khác | — |

---

## Quyết định kỹ thuật

- **`resolveRole(order, userId)`** — hàm pure, chỉ so sánh id. `other` là fallback cho bất kỳ ai không phải 3 bên.
- **ActionBar tách riêng file** — `getActions()` là pure function dễ test. Logic phức tạp nhất của app nằm ở đây.
- **StatusTimeline dùng `React.Fragment` loop** — tránh wrapper View thừa giữa dot và connector.
- **`actualPoints/actualCo2Kg`** — chỉ hiển thị khi `CONFIRMED`. Trước đó dùng `estimatedPoints` kèm dấu `~`.
- **Sticky ActionBar** nằm ngoài `ScrollView` — không scroll mất, luôn tap được.
