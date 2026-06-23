export const validatePrice = (price: number): boolean => {
  return price >= 0 && isFinite(price);
};

export const validateDiscount = (discount: number): boolean => {
  return discount >= 0 && discount <= 100 && isFinite(discount);
};
