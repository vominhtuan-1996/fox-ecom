import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '@/common/theme/colors';
import { spacing, borderRadius, shadows } from '@/common/theme/spacing';
import { typography } from '@/common/theme/typography';
import { DIALOG_CONSTANTS } from '@/common/constants/dialog.constants';
import type { ConfirmDialogConfig } from '@/common/types/dialog.types';

interface DialogConfirmProps {
  config: ConfirmDialogConfig;
  onDismiss: () => void;
}

export const DialogConfirm: React.FC<DialogConfirmProps> = ({
  config,
  onDismiss,
}) => {
  const handleConfirm = () => {
    config.confirmButton?.onPress();
    onDismiss();
  };

  const handleCancel = () => {
    config.cancelButton?.onPress();
    onDismiss();
  };

  const confirmLabel =
    config.confirmButton?.label || DIALOG_CONSTANTS.DEFAULT_CONFIRM_LABEL;
  const cancelLabel =
    config.cancelButton?.label || DIALOG_CONSTANTS.DEFAULT_CANCEL_LABEL;

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.message}>{config.message}</Text>

          <View style={styles.labelsContainer}>
            <TouchableOpacity
              style={[styles.label, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={[styles.labelText, styles.cancelButtonText]}>
                {cancelLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.label, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={[styles.labelText, styles.confirmButtonText]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    minWidth: 280,
    maxWidth: 320,
    ...shadows.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  labelsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.secondaryLight,
  },
  buttonText: {
    ...typography.label,
  },
  labelText: {
    ...typography.label,
  },
  cancelButtonText: {
    color: colors.text,
  },
  confirmButtonText: {
    color: colors.white,
  },
});
