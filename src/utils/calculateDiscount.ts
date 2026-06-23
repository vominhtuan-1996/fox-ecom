/**
 * Calculate discounted price
 */
export const calculateDiscount = (originalPrice: number, discountPercent: number): number => {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percent must be between 0 and 100');
  }
  return originalPrice * (1 - discountPercent / 100);
};
