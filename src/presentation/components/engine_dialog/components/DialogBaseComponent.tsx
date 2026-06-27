import React, { useRef, useEffect } from 'react';
import {
  Animated, View, Text, TouchableOpacity,
  StyleSheet, Dimensions, ScrollView,
} from 'react-native';
import {
  AppDialogConfig, getDialogColors, getDialogIcon, getDialogDefaultTitle,
} from '../models/dialog_config';
import { SdkStrings } from '../../../../common/language';
import { colors } from '../../../../common/theme/colors';
import { spacing } from '../../../../common/theme/spacing';
import { typography } from '../../../../common/theme/typography';

interface Props {
  config: AppDialogConfig;
  onDismiss: () => void;
}

/**
 * DialogBaseComponent — widget nền tảng cho tất cả 4 loại dialog.
 * Animation: Scale (0.8→1) + Fade, tương đương Flutter easeOutBack.
 */
export const DialogBaseComponent: React.FC<Props> = ({ config, onDismiss }) => {
  const type = config.type ?? 'info';
  const token = getDialogColors(type);
  const icon = config.customIcon ?? getDialogIcon(type);
  const title = config.title ?? getDialogDefaultTitle(type);

  const showConfirm = config.showConfirmButton !== false;
  const showCancel = config.showCancelButton === true;

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, damping: 18, stiffness: 260, useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, duration: 200, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleConfirm = () => {
    onDismiss();
    config.onConfirm?.();
  };

  const handleCancel = () => {
    onDismiss();
    config.onCancel?.();
  };

  const handleBackdrop = () => {
    if (config.barrierDismissible !== false) onDismiss();
  };

  return (
    <Animated.View style={[s.backdrop, { opacity: opacityAnim }]}>
      <TouchableOpacity style={s.backdropTouch} activeOpacity={1} onPress={handleBackdrop} />
      <Animated.View style={[s.card, { transform: [{ scale: scaleAnim }] }]}>
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Icon badge */}
          <View style={[s.iconBadge, { backgroundColor: token.background, borderColor: token.border + '4D' }]}>
            {typeof icon === 'string'
              ? <Text style={s.iconText}>{icon}</Text>
              : icon}
          </View>

          {/* Title */}
          <Text style={s.title}>{title}</Text>

          {/* Content */}
          {config.contentWidget ?? (
            <Text style={s.message}>{config.message ?? ''}</Text>
          )}
        </ScrollView>

        {/* Divider */}
        <View style={s.divider} />

        {/* Action buttons */}
        {(showConfirm || showCancel) && (
          <View style={s.btnRow}>
            {showCancel && (
              <TouchableOpacity
                style={[s.btnOutline, { borderColor: token.button + '80', flex: showConfirm ? 1 : undefined }]}
                onPress={handleCancel}
                activeOpacity={0.75}
              >
                <Text style={[s.btnOutlineText, { color: token.button }]}>
                  {config.cancelText ?? SdkStrings.common.cancel}
                </Text>
              </TouchableOpacity>
            )}
            {showCancel && showConfirm && <View style={{ width: spacing.md }} />}
            {showConfirm && (
              <TouchableOpacity
                style={[s.btnFilled, { backgroundColor: token.button, flex: showCancel ? 1 : undefined }]}
                onPress={handleConfirm}
                activeOpacity={0.8}
              >
                <Text style={s.btnFilledText}>
                  {config.confirmText ?? SdkStrings.common.ok}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');
const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  backdropTouch: { ...StyleSheet.absoluteFillObject },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: Math.min(width - 48, 480),
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: 28,
    paddingBottom: spacing.lg,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconText: { fontSize: 30 },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },
  message: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  divider: { height: 1, backgroundColor: colors.border },
  btnRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  btnFilled: {
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  btnFilledText: {
    ...typography.label,
    color: colors.white,
    letterSpacing: 0.2,
  },
  btnOutline: {
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: spacing['2xl'],
  },
  btnOutlineText: { ...typography.label, letterSpacing: 0.2 },
});
