import { calculateDiscount } from '../../src/utils/calculateDiscount';

describe('calculateDiscount', () => {
  it('should calculate 10% discount correctly', () => {
    const result = calculateDiscount(100, 10);
    expect(result).toBe(90);
  });

  it('should calculate 50% discount correctly', () => {
    const result = calculateDiscount(100, 50);
    expect(result).toBe(50);
  });

  it('should return original price with 0% discount', () => {
    const result = calculateDiscount(100, 0);
    expect(result).toBe(100);
  });

  it('should throw error for invalid discount', () => {
    expect(() => calculateDiscount(100, 150)).toThrow('Discount percent must be between 0 and 100');
    expect(() => calculateDiscount(100, -10)).toThrow('Discount percent must be between 0 and 100');
  });
});
