import type { DialogConfig, DialogState } from '@/common/types/dialog.types';

export interface DialogRepository {
  show(config: DialogConfig): Promise<string>;
  dismiss(id: string): void;
  dismissAll(): void;
  getAll(): DialogState[];
  subscribe(listener: (dialogs: DialogState[]) => void): () => void;
}
