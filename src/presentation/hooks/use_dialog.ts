import { useContext } from 'react';
import { DialogContext } from '@/presentation/contexts/DialogContext';
import type { UseDialogReturn } from '@/common/types/dialog.types';

export const useDialog = (): UseDialogReturn => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }

  return context;
};
