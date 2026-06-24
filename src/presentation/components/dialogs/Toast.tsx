import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors } from '@/common/theme/colors';
import { spacing, borderRadius, shadows } from '@/common/theme/spacing';
import { typography } from '@/common/theme/typography';
import { DIALOG_CONSTANTS } from '@/common/constants/dialog.constants';
import type { ToastConfig } from '@/common/types/dialog.types';

interface ToastProps {
  config: ToastConfig;
  onDismiss: () => void;
}

const VARIANT_COLORS = {
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
};

export const Toast: React.FC<ToastProps> = ({ config, onDismiss }) => {
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const variant = config.variant || 'info';
  const duration = config.duration || DIALOG_CONSTANTS.DEFAULT_TOAST_DURATION;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: DIALOG_CONSTANTS.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.delay(duration - DIALOG_CONSTANTS.ANIMATION_DURATION * 2),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: DIALOG_CONSTANTS.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(onDismiss);
  }, [duration, opacityAnim, onDismiss]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: VARIANT_COLORS[variant],
          },
        ]}
      >
        <Text style={styles.text}>{config.message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing['3xl'],
    left: spacing.lg,
    right: spacing.lg,
  },
  toast: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  text: {
    ...typography.bodyMedium,
    color: colors.white,
    textAlign: 'center',
  },
});
