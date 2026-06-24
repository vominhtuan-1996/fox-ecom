import { generateId } from '@/common/utils/id.utils';
import { DIALOG_CONSTANTS } from '@/common/constants/dialog.constants';
import type { DialogConfig, DialogState } from '@/common/types/dialog.types';
import type { DialogRepository } from '@/domain/repositories/dialog.repository';

type DialogListener = (dialogs: DialogState[]) => void;

export class DialogRepositoryImpl implements DialogRepository {
  private dialogs: Map<string, DialogState> = new Map();
  private listeners: Set<DialogListener> = new Set();

  show(config: DialogConfig): Promise<string> {
    return Promise.resolve().then(() => {
      if (this.dialogs.size >= DIALOG_CONSTANTS.MAX_QUEUE_SIZE) {
        const oldestId = Array.from(this.dialogs.values())
          .sort((a, b) => a.createdAt - b.createdAt)[0]?.id;
        if (oldestId) {
          this.dismiss(oldestId);
        }
      }

      const id = generateId();
      const state: DialogState = {
        id,
        config,
        isVisible: true,
        createdAt: Date.now(),
      };

      this.dialogs.set(id, state);
      this.notifyListeners();
      return id;
    });
  }

  dismiss(id: string): void {
    this.dialogs.delete(id);
    this.notifyListeners();
  }

  dismissAll(): void {
    this.dialogs.clear();
    this.notifyListeners();
  }

  getAll(): DialogState[] {
    return Array.from(this.dialogs.values());
  }

  subscribe(listener: DialogListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const dialogs = this.getAll();
    this.listeners.forEach((listener) => listener(dialogs));
  }
}
