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
import type { CustomDialogConfig } from '@/common/types/dialog.types';

interface DialogCustomProps {
  config: CustomDialogConfig;
  onDismiss: () => void;
}

export const DialogCustom: React.FC<DialogCustomProps> = ({
  config,
  onDismiss,
}) => {
  const handleButtonPress = (onPress?: () => void) => {
    onPress?.();
    onDismiss();
  };

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        <View style={styles.dialog}>
          {config.title && <Text style={styles.title}>{config.title}</Text>}

          <View style={styles.content}>{config.content}</View>

          {config.buttons && config.buttons.length > 0 && (
            <View
              style={[
                styles.labelsContainer,
                { flexDirection: config.buttons.length > 2 ? 'column' : 'row' },
              ]}
            >
              {config.buttons.map((button: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.label,
                    {
                      backgroundColor:
                        button.style === 'danger'
                          ? colors.error
                          : button.style === 'primary'
                            ? colors.secondaryLight
                            : colors.gray100,
                      borderWidth: button.style !== 'primary' && button.style !== 'danger' ? 1 : 0,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => handleButtonPress(button.onPress)}
                >
                  <Text
                    style={[
                      styles.labelText,
                      {
                        color:
                          button.style === 'primary' || button.style === 'danger'
                            ? colors.white
                            : colors.text,
                      },
                    ]}
                  >
                    {button.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  content: {
    marginBottom: spacing['2xl'],
  },
  buttonsContainer: {
    marginBottom: spacing.md,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.label,
  },
  labelsContainer: {
    marginBottom: spacing.md,
  },
  label: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  labelText: {
    ...typography.label,
  },
});
