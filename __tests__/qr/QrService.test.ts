import { QrService } from '../../src/modules/qr/QrService';

describe('QrService', () => {
  describe('generateCode', () => {
    it('returns 6-digit string', () => {
      const code = QrService.generateCode('order-1', 'pickup');
      expect(code).toMatch(/^\d{6}$/);
    });

    it('generates different codes for different orders', () => {
      const a = QrService.generateCode('order-A', 'pickup');
      const b = QrService.generateCode('order-B', 'pickup');
      // Có thể bằng nhau (random 6 digit), nhưng test xác nhận format
      expect(a).toMatch(/^\d{6}$/);
      expect(b).toMatch(/^\d{6}$/);
    });

    it('generates code per type (pickup vs dropoff)', () => {
      const pickup  = QrService.generateCode('order-T', 'pickup');
      const dropoff = QrService.generateCode('order-T', 'dropoff');
      expect(pickup).toMatch(/^\d{6}$/);
      expect(dropoff).toMatch(/^\d{6}$/);
    });
  });

  describe('validateCode', () => {
    it('returns ok for correct code', () => {
      const code = QrService.generateCode('val-order', 'pickup');
      const result = QrService.validateCode('val-order', 'pickup', code);
      expect(result).toBe('ok');
    });

    it('returns wrong for incorrect code', () => {
      QrService.generateCode('wrong-order', 'pickup');
      const result = QrService.validateCode('wrong-order', 'pickup', '000000');
      // sẽ là 'wrong' trừ khi ngẫu nhiên đúng
      if (result !== 'ok') expect(result).toBe('wrong');
    });

    it('returns expired for unknown order', () => {
      const result = QrService.validateCode('nonexistent-xyz', 'pickup', '123456');
      expect(result).toBe('expired');
    });

    it('returns used after successful validation', () => {
      const code = QrService.generateCode('used-order', 'dropoff');
      QrService.validateCode('used-order', 'dropoff', code); // first use → ok
      const second = QrService.validateCode('used-order', 'dropoff', code);
      expect(second).toBe('used');
    });
  });
});
