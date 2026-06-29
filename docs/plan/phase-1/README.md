# Phase 1 — Foundation & Design Tokens

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Mục tiêu

Chuẩn hoá toàn bộ design tokens theo FoxPro Design System và tạo bộ shared components tái sử dụng.

---

## Thay đổi

### Theme tokens

| File | Thay đổi |
|---|---|
| `src/common/theme/colors.ts` | Đổi toàn bộ palette sang FoxPro: `primary #FF8500`, `secondary #5933EB`, neutrals `bigStone/paleSky/grayChateau`, surfaces `athensGray/surfacePeach`. Giữ legacy aliases `gray50–gray900` để compat. |
| `src/common/theme/typography.ts` | Scale đầy đủ H1–H5, S1–S2, P1–P3, C1–C2, Label, Tiny, Button. Thêm `fontFamily` (SF Pro Display / Montserrat). |
| `src/common/theme/spacing.ts` | Thêm `layout` constants: `tabBarHeight:62`, `fieldHeight:54`, `hitSlop:44`, `screenPadding:16`. Shadow tokens: `card/pop/bar/knob`. |
| `src/common/theme/gradients.ts` | **Mới.** `orange`, `purple`, `orangeSimple`. |
| `src/common/theme/index.ts` | Export thêm `fontFamily`, `layout`, `gradients`. |

### Shared components

| Component | File | Mô tả |
|---|---|---|
| `AppText` | `shared/AppText.tsx` | Typography variant + color prop |
| `AppButton` | `shared/AppButton.tsx` | 5 variants, 3 sizes, loading state |
| `AppInput` | `shared/AppInput.tsx` | Focus ring `#284EEB`, error state, icon slots |
| `AppCard` | `shared/AppCard.tsx` | Card container + shadow `card` FoxPro |
| `AppBadge` | `shared/AppBadge.tsx` | Pill badge 8 variants màu theo trạng thái |
| `AppDivider` | `shared/AppDivider.tsx` | Horizontal / vertical |
| `AppAvatar` | `shared/AppAvatar.tsx` | Ảnh hoặc chữ cái đầu, 8 màu preset, 5 sizes |
| `AppSearchBar` | `shared/AppSearchBar.tsx` | Pill shape, fill `#ECEDEF`, clear button |
| `AppHeader` | `shared/AppHeader.tsx` | variant `default` (trắng) / `orange` (cam hero) |
| `AppBottomTabBar` | `shared/AppBottomTabBar.tsx` | 4 tab + active dot, `TabKey` type |

Barrel: `src/presentation/components/shared/index.ts`  
Re-export trong: `src/presentation/components/index.ts`

---

## Quyết định kỹ thuật

- **Legacy color aliases giữ lại** — tránh break các component cũ (`ProductCard`, `Cart`, `dialogs/`) chưa migrate.
- **`fontFamily` chỉ define token, không inject vào StyleSheet mặc định** — React Native yêu cầu font được link native. Dùng khi có font bundled.
- **`AppBottomTabBar` nhận `tabs` prop** — không hardcode 4 tab để host app tự định nghĩa icon.
