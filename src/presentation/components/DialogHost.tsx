import React from 'react';
import { View } from 'react-native';
import { DialogAlert } from './dialogs/DialogAlert';
import { DialogConfirm } from './dialogs/DialogConfirm';
import { DialogInput } from './dialogs/DialogInput';
import { DialogCustom } from './dialogs/DialogCustom';
import { Toast } from './dialogs/Toast';
import type { DialogState } from '@/common/types/dialog.types';

interface DialogHostProps {
  dialogs: DialogState[];
  onDismiss: (id: string) => void;
}

export const DialogHost: React.FC<DialogHostProps> = ({ dialogs, onDismiss }) => {
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {dialogs.map((dialog) => {
        const handleDismiss = () => onDismiss(dialog.id);

        switch (dialog.config.type) {
          case 'alert':
            return (
              <DialogAlert
                key={dialog.id}
                config={dialog.config}
                onDismiss={handleDismiss}
              />
            );

          case 'confirm':
            return (
              <DialogConfirm
                key={dialog.id}
                config={dialog.config}
                onDismiss={handleDismiss}
              />
            );

          case 'input':
            return (
              <DialogInput
                key={dialog.id}
                config={dialog.config}
                onDismiss={handleDismiss}
              />
            );

          case 'custom':
            return (
              <DialogCustom
                key={dialog.id}
                config={dialog.config}
                onDismiss={handleDismiss}
              />
            );

          case 'toast':
            return (
              <Toast
                key={dialog.id}
                config={dialog.config}
                onDismiss={handleDismiss}
              />
            );

          default:
            return null;
        }
      })}
    </View>
  );
};
