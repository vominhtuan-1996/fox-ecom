# Design Rules & Compliance — Fox Eco V2

**Bắt buộc tuân thủ** Fox-Eco-Design.md để đảm bảo UI/UX consistency.

---

## 1. Color System Rules

### 1.1. Primary Colors
```
primary-500:    #FF8500 (brand orange) — CTA, buttons, active icons
primary-600:    #FFA800 (orange hover) — pressed button states
primary-100:    #FFF1E6 (light orange) — badge background, highlights
primary-400:    #FF8A00 (mid orange) — active icons, visited links
```

**Rule:** Luôn dùng đúng token color từ design system. Không hardcode màu.

### 1.2. Semantic Colors
```
success-500:    #0BD78C (green) — delivered, completed, checkmark
info-500:       #16ADFF (blue) — info notifications, tracking active
error-500:      #F43F4A (red) — errors, cancellations, warnings
warning-500:    #FFC24D (yellow) — warnings, timeouts
```

**Rule:** Status badges phải dùng semantic color. Ví dụ:
- ✅ Delivered order: bg=#0BD78C
- ❌ Cancelled order: bg=#F43F4A
- ⏳ In transit: bg=#16ADFF

### 1.3. Neutral & Background
```
text-900:       #111C36 (primary text)
text-700:       #3C4459 (secondary text)
text-500:       #666D7C (labels)
text-300:       #A0A4AF (disabled, placeholder)
border-300:     #CFD2D7 (borders)
surface-200:    #F6F6F6 (card background)
background:     #faf9f5 (app background warm off-white)
white:          #FFFFFF (component, modal)
```

**Rule:** Không dùng #000000, #FFFFFF trực tiếp. Dùng token từ theme.

---

## 2. Typography Rules

### 2.1. Font Stack (bắt buộc)
```
font-family: "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

**Rule:** 
- iOS: tự động dùng SF Pro (system font)
- Android: tự động dùng Roboto (system font)
- Fallback: Helvetica Neue

### 2.2. Type Scales (bắt buộc tuân thủ)

| Component | Font Size | Weight | Line Height | Ứng dụng |
|---|---|---|---|---|
| `display` | 28px | 700 | 36px | Screen title chính |
| `heading-1` | 24px | 700 | 32px | Section title |
| `heading-2` | 20px | 600 | 28px | Card title |
| `heading-3` | 18px | 600 | 24px | Sub-heading |
| `body-large` | 16px | 400 | 24px | Body text chính |
| `body` | 14px | 400 | 20px | Body text thường |
| `body-medium` | 14px | 500 | 20px | Label quan trọng |
| `caption` | 12px | 400 | 16px | Meta, timestamp |
| `overline` | 11px | 600 | 16px | Label nhỏ |

**Rule:** 
- Minimum size: 14px (body), 12px (caption) trên mobile
- Vietnamese text: line-height ≥ 1.4× vì diacritics
- Không dùng weight < 400 cho body text

**Code example:**
```typescript
// ✅ Đúng
const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', lineHeight: 32 }, // heading-1
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },  // body
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 }, // caption
});

// ❌ Sai
const styles = StyleSheet.create({
  text: { fontSize: 13, fontWeight: 'normal' }, // không theo scale
  heading: { fontSize: 22 }, // không theo heading token
});
```

---

## 3. Spacing & Layout Rules

### 3.1. Spacing Scale (Base 4px — bắt buộc)

| Token | Value | Ứng dụng |
|---|---|---|
| `space-1` | 4px | Icon padding nhỏ |
| `space-2` | 8px | Compact spacing |
| `space-3` | 12px | Item padding |
| `space-4` | 16px | Standard padding |
| `space-5` | 20px | Section spacing |
| `space-6` | 24px | Large spacing |
| `space-8` | 32px | Section gap |
| `space-10` | 40px | Header, large gap |

**Rule:** Chỉ dùng spacing từ scale trên. Không dùng giá trị random (e.g., 15px, 33px).

**Code example:**
```typescript
// ✅ Đúng
const s = StyleSheet.create({
  container: { padding: 16, gap: 12 }, // space-4, space-3
  section: { marginTop: 24, marginBottom: 24 }, // space-6
});

// ❌ Sai
const s = StyleSheet.create({
  container: { padding: 15, gap: 10 }, // không theo scale
  section: { marginTop: 25 }, // random value
});
```

### 3.2. Border Radius (bắt buộc)

| Token | Value | Ứng dụng |
|---|---|---|
| `radius-sm` | 8px | Tag, badge, input |
| `radius-md` | 12px | Card, button |
| `radius-lg` | 16px | Modal, bottom sheet |
| `radius-xl` | 22px | Logo container, full-rounded card |
| `radius-full` | 9999px | Avatar, pill button |

**Rule:** Luôn dùng token radius. Không hardcode `borderRadius: 10` hay `13`.

### 3.3. Touch Targets (bắt buộc)
```
Minimum:     44×44px (iOS HIG standard)
Recommended: 48×48px (primary buttons)
Icon button: 40×40px (minimum comfortable)
```

**Rule:** Tất cả button, tap target phải ≥ 44px. Không làm quá nhỏ (< 40px).

---

## 4. Component Design Rules

### 4.1. Button States

**Primary Button:**
```
Default:  bg=#FF8500, text=#FFFFFF, radius=8px
Hover:    bg=#FFA800 (darker shade)
Pressed:  bg=#FF8500 (return to default)
Disabled: bg=#ECEDEF, text=#A0A4AF
```

**Secondary Button:**
```
Default:  bg=transparent, border=#FF8500, text=#FF8500, radius=8px
Hover:    bg=#FFF1E6
Pressed:  border-width=2px
Disabled: border=#CFD2D7, text=#A0A4AF
```

**Destructive Button:**
```
Default:  bg=#F43F4A, text=#FFFFFF
Pressed:  bg=#C83237 (darker shade)
Disabled: bg=#ECEDEF, text=#A0A4AF
```

**Rule:** Button phải follow state rules. Implement disabled state.

### 4.2. Card Component

**Specs:**
- Background: #FFFFFF hoặc #FAFAFB
- Border radius: radius-md (12px)
- Shadow: `0 2px 8px rgba(17, 28, 54, 0.08)` — subtle
- Padding: space-4 (16px)

**Rule:** Card luôn có shadow. Border top hoặc left có thể highlight primary color.

### 4.3. Status Badge

**Rules:**
- Size: 16-20px
- Padding: 4-6px horizontal
- Font: caption (12px), weight 500
- Border radius: radius-full (9999px)
- Color: semantic (success/error/warning/info)

| Status | Background | Text |
|---|---|---|
| Delivered | #0BD78C (tint) | #0BD78C |
| In Transit | #16ADFF (tint) | #284EEB |
| Cancelled | #F43F4A (tint) | #F43F4A |
| Pending | #FFF1E6 | #FF8500 |

### 4.4. Bottom Tab Navigation

**Rules:**
- Height: 56px + safe area (iOS)
- Background: #FFFFFF with shadow
- Active tab: text color #FF8500, icon scaled 1.1×
- Inactive tab: text color #A0A4AF, opacity 0.6

**Must have:**
- 4 tabs: Home / Activity / Rank / Profile
- Active tab indicator (underline or color)
- Icon + label (no label-only)

---

## 5. Icon & Asset Rules

### 5.1. Icon Guidelines
```
Size: 20px (standard), 24px (large), 16px (small)
Color: inherit from text color or explicit color
Stroke: 2px (outline icons), 16-20px viewBox
Fill: solid icons OK
```

**Rule:** Dùng SVG icons từ `src/assets/icons/`. Không dùng emoji trực tiếp (ngoại trừ prototype).

### 5.2. V2 Design Icons
```
- bell.svg        (notification bell)
- badge.svg       (counter badge)
- tree.svg        (CO2 impact tree)
- lock.svg        (locked feature)
```

**Rule:** Import từ assets:
```typescript
// ✅ Đúng
import { ICONS } from '@/assets';
<SvgIcon source={ICONS.BELL_V2} size={24} />

// ❌ Sai
<Text>🔔</Text> // emoji trong production
<Image source={require('../assets/icon.png')} /> // hardcoded path
```

---

## 6. Responsive & Layout Rules

### 6.1. Safe Area (bắt buộc)
```
iOS:     44px (notch) + 20px (safe area bottom)
Android: Variable (gesture bar)
```

**Rule:** Tất cả content phải tính safe area. Dùng `useSafeAreaInsets()`.

### 6.2. Modal / Bottom Sheet
```
Border radius (top):   radius-lg (16px)
Animation:            slide up / fade in
Backdrop:             rgba(0,0,0,0.4)
Padding:              space-4 (16px)
```

**Rule:** Modal phải có dismiss gesture (swipe down). Backdrop tắt khi tap outside.

---

## 7. Animation & Transition Rules

### 7.1. Duration Tokens
```
fast:    200ms (simple state change)
normal:  300ms (modal open, fade)
slow:    500ms (complex animation)
```

**Rule:** Không dùng duration > 500ms. Tránh animation = 0 (quá tức time).

### 7.2. Easing
```
easeIn:      accelerate (entrance)
easeOut:     decelerate (exit)
easeInOut:   smooth (transitions)
```

**Rule:** Tất cả transition phải có easing. Không dùng linear cho UI movement.

---

## 8. Dark Mode & Accessibility (Future)

### 8.1. Dark Mode (Chưa support — v2.0)
```
Khi dark mode available:
- background:       #1A1A1A
- surface:         #2D2D2D
- text:            #F5F5F5
- border:          #3D3D3D
```

### 8.2. Accessibility (bắt buộc)
```
- Color contrast: ≥ 4.5:1 (WCAG AA)
- Font size: ≥ 14px (readability)
- Touch targets: ≥ 44×44px (HIG)
- alt text: tất cả image phải có semantic
```

**Rule:** 
- Test contrast ratio: https://www.tpgi.com/color-contrast-checker/
- Icon phải có `accessible={true}` prop
- Button phải có `testID` cho testing

---

## 9. Code Style & Format Rules

### 9.1. StyleSheet Organization
```typescript
// ✅ Đúng: Semantic naming
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: spacing.lg, paddingHorizontal: spacing.md },
  content: { flex: 1, paddingHorizontal: spacing.md },
  button: { minHeight: 44, paddingVertical: spacing.md },
});

// ❌ Sai: Vague names
const styles = StyleSheet.create({
  container: { ...everything },
  box: { padding: 16 },
  btn: { height: 48 }, // không semantic
});
```

### 9.2. Theme & Colors
```typescript
// ✅ Đúng: Import theme
import { colors, spacing, typography } from '@/common/theme';

const s = StyleSheet.create({
  title: { ...typography.h1, color: colors.text },
  card: { padding: spacing.md, borderRadius: spacing.radius.md },
});

// ❌ Sai: Hardcode
const s = StyleSheet.create({
  title: { fontSize: 24, color: '#111C36' }, // hardcoded
  card: { padding: 16, borderRadius: 12 }, // magic number
});
```

---

## 10. Testing & QA Checklist

Before merging feature:

- [ ] Colors match design tokens (no #FFA500, #FF8500)
- [ ] Typography uses scale (14px, 16px, 20px, etc.)
- [ ] Spacing follows 4px grid (no 15px, 33px, etc.)
- [ ] Button/touch target ≥ 44px
- [ ] Safe area respected (no content cutoff on notch)
- [ ] Border radius uses tokens (8px, 12px, 16px, 22px)
- [ ] Status badges use semantic colors
- [ ] Icons from assets, not emoji
- [ ] Animation duration ≤ 500ms, has easing
- [ ] Contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Modal has dismiss gesture
- [ ] Form inputs follow input spec (14px, 44px min-height)

---

## 11. Design System Updates

**Version:** v1.0 (29/06/2026)  
**Source:** Fox-Eco-Design.md  
**Last Updated:** 29/06/2026

When design changes:
1. Update Fox-Eco-Design.md (source of truth)
2. Update theme tokens in `src/common/theme`
3. Update this file (06_design_rules.md)
4. Create migration guide if breaking
5. Tag release: `design-v1.1`

---

**Nguyên tắc:** Consistency > Flexibility. Không phải tất cả component đều phải custom — dùng design system trước.
