import { DialogRepositoryImpl } from '@/data/repositories/dialog.repository.impl';
import { DIALOG_CONSTANTS } from '@/common/constants/dialog.constants';

describe('DialogRepositoryImpl', () => {
  let repository: DialogRepositoryImpl;

  beforeEach(() => {
    repository = new DialogRepositoryImpl();
  });

  describe('show', () => {
    it('should add a dialog to the queue', async () => {
      const id = await repository.show({
        type: 'alert',
        title: 'Test',
        message: 'Test message',
      });

      const dialogs = repository.getAll();
      expect(dialogs).toHaveLength(1);
      expect(dialogs[0].id).toBe(id);
    });

    it('should generate unique IDs', async () => {
      const id1 = await repository.show({
        type: 'alert',
        title: 'Test 1',
        message: 'Message 1',
      });

      const id2 = await repository.show({
        type: 'alert',
        title: 'Test 2',
        message: 'Message 2',
      });

      expect(id1).not.toBe(id2);
      expect(repository.getAll()).toHaveLength(2);
    });

    it('should respect MAX_QUEUE_SIZE limit', async () => {
      for (let i = 0; i < DIALOG_CONSTANTS.MAX_QUEUE_SIZE + 2; i++) {
        await repository.show({
          type: 'alert',
          title: `Test ${i}`,
          message: `Message ${i}`,
        });
      }

      const dialogs = repository.getAll();
      expect(dialogs.length).toBeLessThanOrEqual(DIALOG_CONSTANTS.MAX_QUEUE_SIZE);
    });
  });

  describe('dismiss', () => {
    it('should remove a dialog by ID', async () => {
      const id = await repository.show({
        type: 'alert',
        title: 'Test',
        message: 'Message',
      });

      expect(repository.getAll()).toHaveLength(1);

      repository.dismiss(id);
      expect(repository.getAll()).toHaveLength(0);
    });

    it('should not affect other dialogs', async () => {
      const id1 = await repository.show({
        type: 'alert',
        title: 'Test 1',
        message: 'Message 1',
      });

      const id2 = await repository.show({
        type: 'alert',
        title: 'Test 2',
        message: 'Message 2',
      });

      repository.dismiss(id1);
      const dialogs = repository.getAll();
      expect(dialogs).toHaveLength(1);
      expect(dialogs[0].id).toBe(id2);
    });
  });

  describe('dismissAll', () => {
    it('should remove all dialogs', async () => {
      await repository.show({
        type: 'alert',
        title: 'Test 1',
        message: 'Message 1',
      });

      await repository.show({
        type: 'alert',
        title: 'Test 2',
        message: 'Message 2',
      });

      expect(repository.getAll()).toHaveLength(2);

      repository.dismissAll();
      expect(repository.getAll()).toHaveLength(0);
    });
  });

  describe('subscribe', () => {
    it('should notify listeners when dialog is added', async () => {
      const listener = jest.fn();
      repository.subscribe(listener);

      await repository.show({
        type: 'alert',
        title: 'Test',
        message: 'Message',
      });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          config: expect.objectContaining({ type: 'alert' }),
        }),
      ]));
    });

    it('should notify listeners when dialog is dismissed', async () => {
      const listener = jest.fn();
      const id = await repository.show({
        type: 'alert',
        title: 'Test',
        message: 'Message',
      });

      repository.subscribe(listener);
      listener.mockClear();

      repository.dismiss(id);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith([]);
    });

    it('should unsubscribe listener', async () => {
      const listener = jest.fn();
      const unsubscribe = repository.subscribe(listener);

      unsubscribe();

      await repository.show({
        type: 'alert',
        title: 'Test',
        message: 'Message',
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return all dialogs', async () => {
      await repository.show({
        type: 'alert',
        title: 'Test 1',
        message: 'Message 1',
      });

      await repository.show({
        type: 'confirm',
        title: 'Test 2',
        message: 'Message 2',
      });

      const dialogs = repository.getAll();
      expect(dialogs).toHaveLength(2);
      expect(dialogs[0].config.type).toBe('alert');
      expect(dialogs[1].config.type).toBe('confirm');
    });

    it('should return empty array when no dialogs', () => {
      const dialogs = repository.getAll();
      expect(dialogs).toHaveLength(0);
    });
  });
});
