# Phase 3 — BoardScreen + CreateScreen

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Mục tiêu

Luồng chính của người gửi: xem danh sách đơn cần người chở và đăng đơn mới.

---

## Thay đổi

| File | Loại | Mô tả |
|---|---|---|
| `src/modules/carry/types.ts` | Mới | Data model: `Order`, `Hub`, `CarryUser`, `CreateOrderInput`, `OrderStatus`, `ItemSize` |
| `src/modules/carry/CarryService.ts` | Mới | Mock service: 6 hubs FTel, 5 users, 3 đơn sample, CRUD in-memory |
| `src/modules/carry/index.ts` | Mới | Barrel export |
| `src/presentation/screens/carry/OrderCard.tsx` | Mới | Card hiển thị đơn: tuyến, mô tả, size badge, deadline, điểm, CO₂ |
| `src/presentation/screens/carry/BoardScreen.tsx` | Mới | Danh sách đơn OPEN + search filter + FAB "+" |
| `src/presentation/screens/carry/CreateScreen.tsx` | Mới | Form tạo đơn: hub picker, receiver picker, size selector, reward preview |
| `src/presentation/screens/carry/index.ts` | Mới | Barrel export |
| `example/SDKComponents.js` | Sửa | Demo BoardScreen + CreateScreen |

---

## Thiết kế chi tiết

### CarryService
```
HUBS (6):  hcm-ftw, hcm-hub, hcm-bd, hn-fpt, hn-hub, hn-hd
Users (5): mock data, searchUsers(query) debounce-ready
getBoard(fromId?, toId?)  → Order[] OPEN, sort by deadline ASC
createOrder(input, sender) → Order  (in-memory store)
claimOrder(orderId, carrier) → Order (OPEN → CLAIMED)
updateStatus(orderId, status) → Order
```

### Point & CO₂ formula
```
km = KM_BETWEEN[fromId|toId]  (hardcoded matrix, fallback 10)
points = 10 + km + SIZE_BONUS[size]   (S:+0, M:+5, L:+10)
co2Kg  = km × 0.07
```

### BoardScreen
```
┌─────────────────────────────────┐
│ Header cam                      │
│  ‹  Giao hàng tiện đường   [▣] │
│  [🔍 Tìm theo tuyến, mô tả...] │
├─────────────────────────────────┤
│  OrderCard (FlatList)           │
│   ─ FPT Tower → NVL Hub   [cam]│
│     Tài liệu hợp đồng Q2       │
│     [Nhỏ] · ⏰ 2 giờ nữa       │
│                  +22đ  🌿0.84kg │
│   ─ ...                         │
├─────────────────────────────────┤
│                          [+ FAB]│
└─────────────────────────────────┘
```

### CreateScreen — flow
```
1. Chọn Điểm đi  → HubSheet (bottom modal)
2. Chọn Điểm đến → HubSheet
3. Chọn Người nhận → ReceiverSheet (search + FlatList)
4. Mô tả hàng hóa (TextInput multiline)
5. Kích thước: S / M / L (segmented)
6. Giá trị hàng (numeric, optional)
7. RewardPreviewCard (tự tính khi đủ from+to+size)
8. Nút "Đăng đơn" → CarryService.createOrder() → onCreated(id)
```

---

## Quyết định kỹ thuật

- **In-memory store với `let _orders`** — đủ cho demo/dev, thay bằng API call khi có BE.
- **KM_BETWEEN hardcode** — chỉ 6 hubs, 15 cặp tuyến. Thay bằng Google Maps Distance Matrix khi production.
- **ReceiverSheet tự search** — `useMemo` filter trong component, không cần debounce hook riêng vì mock data nhỏ.
- **Deadline mặc định +24h** — CreateScreen chưa có DateTimePicker. Phase 4 sẽ thêm khi làm DetailScreen.
- **HubSheet và ReceiverSheet định nghĩa trong cùng file CreateScreen** — chỉ dùng ở đây, YAGNI.
