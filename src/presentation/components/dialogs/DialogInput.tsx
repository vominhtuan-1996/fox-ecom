import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '@/common/theme/colors';
import { spacing, borderRadius, shadows } from '@/common/theme/spacing';
import { typography } from '@/common/theme/typography';
import { DIALOG_CONSTANTS } from '@/common/constants/dialog.constants';
import type { InputDialogConfig } from '@/common/types/dialog.types';

interface DialogInputProps {
  config: InputDialogConfig;
  onDismiss: () => void;
}

export const DialogInput: React.FC<DialogInputProps> = ({
  config,
  onDismiss,
}) => {
  const [value, setValue] = useState(config.defaultValue || '');

  const handleSubmit = () => {
    config.onSubmit(value);
    onDismiss();
  };

  const handleCancel = () => {
    config.onCancel?.();
    onDismiss();
  };

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

          {config.message && (
            <Text style={styles.message}>{config.message}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder={config.placeholder}
            value={value}
            onChangeText={setValue}
            placeholderTextColor={colors.textTertiary}
          />

          <View style={styles.labelsContainer}>
            <TouchableOpacity
              style={[styles.label, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={[styles.labelText, styles.cancelButtonText]}>
                {DIALOG_CONSTANTS.DEFAULT_CANCEL_LABEL}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.label, styles.confirmButton]}
              onPress={handleSubmit}
            >
              <Text style={[styles.labelText, styles.confirmButtonText]}>
                {DIALOG_CONSTANTS.DEFAULT_CONFIRM_LABEL}
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
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
    color: colors.text,
    ...typography.bodyMedium,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginRight: spacing.md,
  },
  labelsContainer: {
    flexDirection: 'row',
    marginRight: spacing.md,
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
