import React, { createContext } from 'react';
import type { UseDialogReturn } from '@/common/types/dialog.types';

export const DialogContext = createContext<UseDialogReturn | undefined>(
  undefined
);

DialogContext.displayName = 'DialogContext';
