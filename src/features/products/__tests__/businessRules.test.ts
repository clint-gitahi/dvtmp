import {
  canAddToCart,
  describeCartIneligibility,
  getCartIneligibilityReason,
  isLowStock,
  isOutOfStock,
  isPremium,
  maxQuantityInCart,
  LOW_STOCK_THRESHOLD,
  MIN_RATING_FOR_CART,
  PREMIUM_PRICE_THRESHOLD,
  PREMIUM_RATING_THRESHOLD,
} from '@features/products/businessRules';

describe('isPremium (Rule A)', () => {
  it('exposes the thresholds the spec calls out', () => {
    expect(PREMIUM_RATING_THRESHOLD).toBe(4.5);
    expect(PREMIUM_PRICE_THRESHOLD).toBe(1000);
  });

  it('is true at the inclusive boundary (rating 4.5 AND price 1000)', () => {
    expect(isPremium({ rating: 4.5, price: 1000 })).toBe(true);
  });

  it('is true when both criteria are well above the boundary', () => {
    expect(isPremium({ rating: 4.9, price: 2500 })).toBe(true);
  });

  it('is false when rating is just below the threshold', () => {
    expect(isPremium({ rating: 4.49, price: 5000 })).toBe(false);
  });

  it('is false when price is just below the threshold', () => {
    expect(isPremium({ rating: 5.0, price: 999.99 })).toBe(false);
  });

  it('is false when only one criterion passes', () => {
    expect(isPremium({ rating: 4.7, price: 50 })).toBe(false);
    expect(isPremium({ rating: 2.0, price: 5000 })).toBe(false);
  });
});

describe('isLowStock (Rule B)', () => {
  it('LOW_STOCK_THRESHOLD is 10 per spec', () => {
    expect(LOW_STOCK_THRESHOLD).toBe(10);
  });

  it.each([1, 5, 9])('is true for stock = %i (in the (0, 10) range)', stock => {
    expect(isLowStock({ stock })).toBe(true);
  });

  it('is false at stock = 0 (that is out-of-stock, a different state)', () => {
    expect(isLowStock({ stock: 0 })).toBe(false);
  });

  it('is false at the boundary stock = 10', () => {
    expect(isLowStock({ stock: 10 })).toBe(false);
  });

  it('is false for healthy stock', () => {
    expect(isLowStock({ stock: 100 })).toBe(false);
  });
});

describe('isOutOfStock', () => {
  it('is true for stock 0 and negative', () => {
    expect(isOutOfStock({ stock: 0 })).toBe(true);
    expect(isOutOfStock({ stock: -3 })).toBe(true);
  });
  it('is false for any positive stock', () => {
    expect(isOutOfStock({ stock: 1 })).toBe(false);
  });
});

describe('canAddToCart (Rule C)', () => {
  it('MIN_RATING_FOR_CART is 3 per spec', () => {
    expect(MIN_RATING_FOR_CART).toBe(3);
  });

  it('refuses out-of-stock products', () => {
    expect(canAddToCart({ stock: 0, rating: 5 })).toBe(false);
  });

  it('refuses low-rated products even with stock', () => {
    expect(canAddToCart({ stock: 100, rating: 2.9 })).toBe(false);
  });

  it('accepts at the inclusive rating boundary', () => {
    expect(canAddToCart({ stock: 1, rating: MIN_RATING_FOR_CART })).toBe(true);
  });

  it('accepts a normal in-stock decently-rated product', () => {
    expect(canAddToCart({ stock: 25, rating: 4.2 })).toBe(true);
  });
});

describe('getCartIneligibilityReason', () => {
  it('out-of-stock takes precedence over low rating', () => {
    expect(getCartIneligibilityReason({ stock: 0, rating: 1.0 })).toBe('out-of-stock');
    expect(getCartIneligibilityReason({ stock: 0, rating: 5.0 })).toBe('out-of-stock');
  });

  it('returns low-rating when in stock but rating < 3', () => {
    expect(getCartIneligibilityReason({ stock: 10, rating: 2.9 })).toBe('low-rating');
  });

  it('returns null when the product is fully eligible', () => {
    expect(getCartIneligibilityReason({ stock: 10, rating: 4 })).toBeNull();
  });
});

describe('describeCartIneligibility', () => {
  it('produces user-facing copy for each reason', () => {
    expect(describeCartIneligibility('out-of-stock')).toBe('Out of stock');
    expect(describeCartIneligibility('low-rating')).toBe('Rating too low to add');
  });
});

describe('maxQuantityInCart', () => {
  it('mirrors stock when positive', () => {
    expect(maxQuantityInCart({ stock: 7 })).toBe(7);
  });
  it('clamps to 0 for non-positive stock', () => {
    expect(maxQuantityInCart({ stock: 0 })).toBe(0);
    expect(maxQuantityInCart({ stock: -1 })).toBe(0);
  });
});