/**
 * Animation Configurations
 * Animation presets and timing constants
 */

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FASTEST: 100,
  FASTER: 150,
  FAST: 200,
  BASE: 300,
  SLOW: 500,
  SLOWER: 700,
  SLOWEST: 1000,
} as const;

// Animation easing functions
export const ANIMATION_EASING = {
  LINEAR: 'linear',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  EASE_IN_CUBIC: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  EASE_OUT_CUBIC: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  EASE_IN_OUT_CUBIC: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  EASE_IN_BOUNCE: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  EASE_OUT_BOUNCE: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

// Common animation presets
export const ANIMATION_PRESETS = {
  FADE_IN: {
    duration: ANIMATION_DURATIONS.BASE,
    easing: ANIMATION_EASING.EASE_OUT,
  },
  FADE_OUT: {
    duration: ANIMATION_DURATIONS.BASE,
    easing: ANIMATION_EASING.EASE_IN,
  },
  SLIDE_IN_RIGHT: {
    duration: ANIMATION_DURATIONS.BASE,
    easing: ANIMATION_EASING.EASE_OUT_CUBIC,
  },
  SLIDE_OUT_LEFT: {
    duration: ANIMATION_DURATIONS.BASE,
    easing: ANIMATION_EASING.EASE_IN_CUBIC,
  },
  BOUNCE_IN: {
    duration: ANIMATION_DURATIONS.SLOW,
    easing: ANIMATION_EASING.EASE_OUT_BOUNCE,
  },
  SCALE_UP: {
    duration: ANIMATION_DURATIONS.FAST,
    easing: ANIMATION_EASING.EASE_OUT,
  },
  PULSE: {
    duration: ANIMATION_DURATIONS.FASTER,
    easing: ANIMATION_EASING.LINEAR,
  },
} as const;

// Lottie animation files — not included in SDK package
// Apps should provide their own Lottie JSON files
export const LOTTIE_ANIMATIONS = {} as const;

export type AnimationPresetKey = keyof typeof ANIMATION_PRESETS;
export type LottieAnimationKey = keyof typeof LOTTIE_ANIMATIONS;
