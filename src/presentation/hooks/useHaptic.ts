/**
 * useHaptic — haptic feedback wrapper.
 * Dùng react-native built-in Vibration (không cần native module).
 * Pattern: success=10ms · error=50ms · light=5ms
 */
import { Vibration, Platform } from 'react-native';

type HapticType = 'success' | 'error' | 'light';

const PATTERNS: Record<HapticType, number | number[]> = {
  light:   Platform.OS === 'ios' ? 5  : 10,
  success: Platform.OS === 'ios' ? 10 : [0, 30],
  error:   Platform.OS === 'ios' ? 50 : [0, 50, 30, 50],
};

export function useHaptic() {
  return {
    trigger: (type: HapticType = 'light') => {
      const pattern = PATTERNS[type];
      if (Array.isArray(pattern)) Vibration.vibrate(pattern);
      else Vibration.vibrate(pattern);
    },
  };
}
