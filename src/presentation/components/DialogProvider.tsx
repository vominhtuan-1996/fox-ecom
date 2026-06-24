import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { DialogContext } from '@/presentation/contexts/DialogContext';
import { DialogRepositoryImpl } from '@/data/repositories/dialog.repository.impl';
import { ShowDialogUsecase } from '@/domain/usecases/show_dialog.usecase';
import { DialogHost } from './DialogHost';
import type { DialogConfig, DialogState, UseDialogReturn } from '@/common/types/dialog.types';
import { DIALOG_CONSTANTS } from '@/common/constants/dialog.constants';

interface DialogProviderProps {
  children: React.ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [dialogs, setDialogs] = useState<DialogState[]>([]);

  const dialogRepository = React.useMemo(
    () => new DialogRepositoryImpl(),
    []
  );

  const showDialogUsecase = React.useMemo(
    () => new ShowDialogUsecase(dialogRepository),
    [dialogRepository]
  );

  useEffect(() => {
    const unsubscribe = dialogRepository.subscribe((newDialogs) => {
      setDialogs(newDialogs);
    });

    return unsubscribe;
  }, [dialogRepository]);

  const alertDialog = useCallback(
    async (config: Omit<DialogConfig, 'type'> & { type?: never }) => {
      await showDialogUsecase.execute({
        type: 'alert',
        ...config,
      } as DialogConfig);
    },
    [showDialogUsecase]
  );

  const confirmDialog = useCallback(
    async (config: Omit<DialogConfig, 'type'> & { type?: never }) => {
      return new Promise<boolean>((resolve) => {
        const originalConfirmButton = (config as any).confirmButton;
        const originalCancelButton = (config as any).cancelButton;
        let dialogId: string;

        const newConfig = {
          type: 'confirm',
          ...config,
          confirmButton: {
            label: originalConfirmButton?.label || DIALOG_CONSTANTS.DEFAULT_CONFIRM_LABEL,
            style: 'primary' as const,
            onPress: () => {
              originalConfirmButton?.onPress?.();
              dialogRepository.dismiss(dialogId);
              resolve(true);
            },
          },
          cancelButton: {
            label: originalCancelButton?.label || DIALOG_CONSTANTS.DEFAULT_CANCEL_LABEL,
            onPress: () => {
              originalCancelButton?.onPress?.();
              dialogRepository.dismiss(dialogId);
              resolve(false);
            },
          },
        };

        showDialogUsecase.execute(newConfig as DialogConfig).then((id) => {
          dialogId = id;
        });
      });
    },
    [showDialogUsecase, dialogRepository]
  );

  const inputDialog = useCallback(
    async (config: Omit<DialogConfig, 'type'> & { type?: never }) => {
      return new Promise<string | null>((resolve) => {
        const newConfig = {
          type: 'input',
          ...config,
          onSubmit: (value: string) => {
            (config as any).onSubmit?.(value);
            resolve(value);
          },
          onCancel: () => {
            (config as any).onCancel?.();
            resolve(null);
          },
        };

        showDialogUsecase.execute(newConfig as DialogConfig);
      });
    },
    [showDialogUsecase]
  );

  const customDialog = useCallback(
    async (config: Omit<DialogConfig, 'type'> & { type?: never }) => {
      await showDialogUsecase.execute({
        type: 'custom',
        ...config,
      } as DialogConfig);
    },
    [showDialogUsecase]
  );

  const toastDialog = useCallback(
    (config: Omit<DialogConfig, 'type'> & { type?: never }) => {
      showDialogUsecase.execute({
        type: 'toast',
        duration: DIALOG_CONSTANTS.DEFAULT_TOAST_DURATION,
        ...config,
      } as DialogConfig);
    },
    [showDialogUsecase]
  );

  const dismiss = useCallback(
    (id: string) => {
      dialogRepository.dismiss(id);
    },
    [dialogRepository]
  );

  const dismissAll = useCallback(() => {
    dialogRepository.dismissAll();
  }, [dialogRepository]);

  const value: UseDialogReturn = {
    alert: alertDialog,
    confirm: confirmDialog,
    input: inputDialog,
    custom: customDialog,
    toast: toastDialog,
    dismiss,
    dismissAll,
  };

  return (
    <DialogContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        <DialogHost dialogs={dialogs} onDismiss={dismiss} />
      </View>
    </DialogContext.Provider>
  );
};
