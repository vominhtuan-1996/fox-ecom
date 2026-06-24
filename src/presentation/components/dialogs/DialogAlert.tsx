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
import type { AlertDialogConfig } from '@/common/types/dialog.types';

interface DialogAlertProps {
  config: AlertDialogConfig;
  onDismiss: () => void;
}

export const DialogAlert: React.FC<DialogAlertProps> = ({
  config,
  onDismiss,
}) => {
  const handleButtonPress = () => {
    config.button?.onPress();
    onDismiss();
  };

  const buttonLabel = config.button?.label || DIALOG_CONSTANTS.DEFAULT_BUTTON_LABEL;

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.message}>{config.message}</Text>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  config.button?.style === 'danger'
                    ? colors.error
                    : colors.secondaryLight,
              },
            ]}
            onPress={handleButtonPress}
          >
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </TouchableOpacity>
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
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.label,
    color: colors.white,
  },
});
