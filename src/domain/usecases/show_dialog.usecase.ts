import type { DialogConfig } from '@/common/types/dialog.types';
import type { DialogRepository } from '@/domain/repositories/dialog.repository';

export class ShowDialogUsecase {
  constructor(private readonly dialogRepository: DialogRepository) {}

  async execute(config: DialogConfig): Promise<string> {
    return this.dialogRepository.show(config);
  }
}
