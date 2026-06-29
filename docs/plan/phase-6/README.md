# Phase 6 — My Orders + RouteFilter

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Mục tiêu

Quản lý đơn hàng cá nhân và lọc đơn theo tuyến đường.

---

## Thay đổi

| File | Loại | Mô tả |
|---|---|---|
| `screens/orders/MyOrdersScreen.tsx` | Mới | 2 lớp tab: Feature (Giao hàng/Đón con/Đi làm chung) + Carry (Tôi gửi/Tôi chở/Tôi nhận) |
| `screens/orders/RouteFilterScreen.tsx` | Mới | Picker from/to hub, swap button, toggle "Tuyến của tôi", radio list |
| `screens/orders/index.ts` | Mới | Barrel export + `RouteFilter` type |
| `example/SDKComponents.js` | Sửa | 2 demo: MyOrdersScreen + RouteFilterScreen |

---

## Thiết kế chi tiết

### MyOrdersScreen — Tab hierarchy
```
Feature tabs (scroll ngang):
  [Giao hàng ●] [Đón con · Sắp có] [Đi làm chung · Sắp có]
                    ↓ khi chọn Giao hàng
Carry sub-tabs (segmented):
  [Tôi gửi] [Tôi chở] [Tôi nhận]
                    ↓
FlatList OrderCard → filter theo sender/carrier/receiver.id
```
- "Đón con" và "Đi làm chung" disabled + chip "Sắp có", tap → không có gì
- Tab active: underline cam, text cam bold
- Sub-tab active: background trắng nổi trên nền xám

### RouteFilterScreen
```
Header: [✕ Đóng] [Tiêu đề] [Xoá]
Route picker: [TỪ box] [⇄ swap] [ĐẾN box]
  → tap box → section active → hub list bên dưới thay đổi
Toggle: "Tuyến đường của tôi" (Switch)
Hub list: radio rows, "Tất cả" là option đầu (unset)
Footer sticky: [Lọc đơn] button
```

### `RouteFilter` type (export)
```ts
interface RouteFilter {
  fromHub?: Hub;
  toHub?: Hub;
  myRouteOnly: boolean;
}
```

---

## Quyết định kỹ thuật

- **2 lớp tab không dùng navigator** — `useState` local đủ, không cần stack/tab navigator riêng cho màn hình này.
- **RouteFilter export từ screen file** — type nhỏ, chỉ dùng giữa RouteFilterScreen và BoardScreen, không cần file types riêng.
- **Swap button** hoán đổi `fromHub ↔ toHub` in-place, không reset list.
- **"Tất cả" là hub giả** `id: ''` — khi apply filter, `fromHub === undefined` nghĩa là không lọc, `CarryService.getBoard()` không pass `fromId`.
