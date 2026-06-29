# Phase 9 — Polish & Production

**Trạng thái:** ✅ Hoàn thành  
**Ngày:** 2026-06-27

---

## Mục tiêu

Micro-interactions, loading states, offline handling, haptic feedback và các optimization cuối trước khi ship.

---

## Thay đổi

| File | Loại | Mô tả |
|---|---|---|
| `shared/SkeletonLoader.tsx` | Mới | `SkeletonBox`, `SkeletonOrderCard`, `SkeletonList` — shimmer opacity loop |
| `shared/OfflineBanner.tsx` | Mới | Slide-down banner "không có mạng", animate in/out |
| `shared/ConfettiView.tsx` | Mới | 40 confetti particles rơi từ trên xuống, deterministic delay |
| `shared/index.ts` | Sửa | Export 3 component mới |
| `hooks/useNetworkState.ts` | Mới | Fetch ping 30s + AppState active → `isOnline: boolean` |
| `hooks/useHaptic.ts` | Mới | Vibration wrapper: `success / error / light` |
| `hooks/index.ts` | Sửa | Export 2 hook mới |
| `screens/carry/BoardScreen.tsx` | Sửa | Skeleton 800ms trước khi load, `OfflineBanner`, `getItemLayout` |
| `screens/qr/ScanScreen.tsx` | Sửa | Haptic `success` khi scan OK, `error` khi sai mã |
| `screens/carry/detail/DetailScreen.tsx` | Sửa | `ConfettiView` tự động bắn khi `status === CONFIRMED` |
| `example/SDKComponents.js` | Sửa | 4 demo: SkeletonList, OfflineBanner, ConfettiView, BoardScreen với skeleton |

---

## Chi tiết implement

### SkeletonLoader — shimmer
```
Animated.loop(sequence([
  timing(0→1, 900ms),   // fade in
  timing(1→0, 900ms),   // fade out
]))
opacity: 0.35 → 0.7
```
`SkeletonOrderCard` = 1 card placeholder với đúng layout OrderCard (route row, desc, meta row).

### OfflineBanner
```
visible prop → Animated.timing 300ms
translateY: -40 → 0  (slide down)
opacity: 0 → 1
zIndex: 999, position: absolute, top: 0
```

### ConfettiView
```
40 particles, mỗi cái có:
  x: random 0..W (reset khi visible)
  y: -20 → H+20 (2200ms + delay ngẫu nhiên 0-600ms)
  rotate: 0 → 1080deg
  opacity: 1 → 0 (bắt đầu fade ở 1600ms + delay)
pointerEvents: 'none' — không block tap
auto-unmount sau khi Animated.parallel done → onDone()
```

### useNetworkState
```
fetch 'https://clients3.google.com/generate_204' với AbortController 3s timeout
Interval 30s + AppState 'active' trigger
Không cần @react-native-community/netinfo
```

### useHaptic
```
Vibration.vibrate() — built-in RN, không cần native module
success: iOS 10ms / Android [0,30]
error:   iOS 50ms / Android [0,50,30,50]
light:   iOS 5ms  / Android 10ms
```

### BoardScreen optimizations
```
loading state: true → false sau 800ms (simulated)
→ nếu loading: render <SkeletonList count={4} />
→ nếu loaded:  render FlatList với getItemLayout

getItemLayout: (_, index) => ({ length: CARD_HEIGHT, offset: CARD_HEIGHT * index, index })
CARD_HEIGHT = 160 + spacing.md (ước tính)
→ FlatList không cần đo layout từng item → scroll nhanh hơn
```

---

## Quyết định kỹ thuật

- **`SkeletonBox` tự có shimmer riêng** — mỗi box một `Animated.Value` độc lập. Trade-off: nhiều animation loop hơn, nhưng tránh phải share context. Chấp nhận vì count thấp (< 20 box).
- **`ConfettiView` không unmount khi `visible=false`** — return null để tránh re-create particles array khi toggle.
- **`useNetworkState` dùng fetch thay netinfo** — tránh thêm native dependency. Nhược điểm: network call thực sự, không instant. Chấp nhận vì interval 30s.
- **`getItemLayout` CARD_HEIGHT hardcode** — nếu card height thay đổi cần update constant này. Annotate bằng comment trong code.
- **Haptic dùng `Vibration`** — iOS Taptic Engine không support qua Vibration (chỉ rung). Production nên dùng `react-native-haptic-feedback` khi cần tactile feedback chuẩn.
