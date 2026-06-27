import React, { useRef, useEffect } from 'react';
import {
  Animated, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { AppSnackbarConfig, getSnackbarBg, getSnackbarIcon } from '../models/dialog_config';
import { spacing } from '../../../../common/theme/spacing';
import { typography } from '../../../../common/theme/typography';

interface Props {
  config: AppSnackbarConfig;
  position: 'top' | 'bottom';
  onClose: () => void;
}

/**
 * SnackbarBaseComponent — widget hiển thị snackbar.
 * top: slide từ trên xuống, bottom: slide từ dưới lên.
 */
export const SnackbarBaseComponent: React.FC<Props> = ({ config, position, onClose }) => {
  const type = config.type ?? 'info';
  const bgColor = getSnackbarBg(type);
  const icon = config.customIcon ?? getSnackbarIcon(type);

  const slideAnim = useRef(new Animated.Value(position === 'top' ? -120 : 120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0, damping: 20, stiffness: 280, useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -120 : 120,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onClose);
  };

  // Leading
  const leading = config.leading ?? (
    <View style={[s.iconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
      {typeof icon === 'string'
        ? <Text style={{ fontSize: 16 }}>{icon}</Text>
        : icon}
    </View>
  );

  // Trailing
  const trailing = config.trailing ?? (
    <View style={s.trailingRow}>
      {config.actionLabel && (
        <TouchableOpacity
          style={s.actionBtn}
          onPress={() => { dismiss(); config.onAction?.(); }}
          activeOpacity={0.75}
        >
          <Text style={s.actionText}>{config.actionLabel}</Text>
        </TouchableOpacity>
      )}
      {config.additionalActions?.map((act, i) => (
        <View key={i} style={{ marginLeft: spacing.sm }}>{act}</View>
      ))}
      {config.showCloseButton !== false && (
        <TouchableOpacity onPress={dismiss} style={s.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.closeIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Animated.View style={{
      transform: [{ translateY: slideAnim }],
      opacity: opacityAnim,
    }}>
      <View style={[s.container, { backgroundColor: bgColor }]}>
        {leading}
        <View style={s.content}>
          {config.contentWidget ?? (
            <Text style={s.message} numberOfLines={3}>{config.message}</Text>
          )}
        </View>
        {trailing}
      </View>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  content: { flex: 1, marginRight: spacing.sm },
  message: { ...typography.bodySm, color: '#fff', lineHeight: 18 },
  trailingRow: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionText: { ...typography.labelSm, color: '#fff', fontWeight: '700' as const },
  closeBtn: { marginLeft: spacing.sm },
  closeIcon: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
});
