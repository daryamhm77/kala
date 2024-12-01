export function calculateDiscount(
  price: number = 0,
  discountPercent: number = 0,
) {
  if (discountPercent > 100 || !discountPercent || discountPercent < 0)
    discountPercent = 0;
  return price - price * (discountPercent / 100);
}
