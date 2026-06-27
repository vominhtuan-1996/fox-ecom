// FoxPro Design System — Spacing, radius, shadow tokens
// Base grid: 4px

export const spacing = {
  0:     0,
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
} as const;

export const borderRadius = {
  xs:   4,
  sm:   8,    // inputs, search bar
  md:   12,   // buttons, switch track
  lg:   16,   // cards, app icon
  pill: 9999, // avatars, chips, badge
  // legacy
  xl:   16,
  full: 9999,
} as const;

export const shadows = {
  // FoxPro shadow tokens
  knob: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  bar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
  },
  pop: {
    shadowColor: '#111C36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  // legacy aliases
  sm:  { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2,  elevation: 2  },
  md:  { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4,  elevation: 4  },
  lg:  { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8  },
  xl:  { shadowColor: '#111C36', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 16 },
} as const;

// ── Layout constants (FoxPro) ─────────────────────────────────────
export const layout = {
  tabBarHeight:  62,
  fieldHeight:   54,   // full-width button/input height
  hitSlop:       44,   // minimum touch target
  screenPadding: 16,   // horizontal page padding
  cardPadding:   16,
  headerHeight:  56,
} as const;
