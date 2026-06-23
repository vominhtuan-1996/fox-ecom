import { formatPrice } from '../../src/utils/formatPrice';

describe('formatPrice', () => {
  it('should format price with USD currency', () => {
    const result = formatPrice(29.99, 'USD');
    expect(result).toContain('29.99');
  });

  it('should handle default USD currency', () => {
    const result = formatPrice(99.99);
    expect(result).toContain('99.99');
  });

  it('should format large numbers correctly', () => {
    const result = formatPrice(1000.5, 'USD');
    expect(result).toContain('1,000.5');
  });
});
