import type { Product } from '@models/Product';

export const PREMIUM_RATING_THRESHOLD = 4.5;
export const PREMIUM_PRICE_THRESHOLD = 1000;
export const LOW_STOCK_THRESHOLD = 10;
export const MIN_RATING_FOR_CART = 3;

export function isPremium(product: Pick<Product, 'rating' | 'price'>): boolean {
  return (
    product.rating >= PREMIUM_RATING_THRESHOLD &&
    product.price >= PREMIUM_PRICE_THRESHOLD
  );
}

export function isLowStock(product: Pick<Product, 'stock'>): boolean {
  return product.stock > 0 && product.stock < LOW_STOCK_THRESHOLD;
}

export function isOutOfStock(product: Pick<Product, 'stock'>): boolean {
  return product.stock <= 0;
}

export function canAddToCart(product: Pick<Product, 'stock' | 'rating'>): boolean {
  if (product.stock <= 0) return false;
  if (product.rating < MIN_RATING_FOR_CART) return false;
  return true;
}

export type CartIneligibilityReason =
  | 'out-of-stock'
  | 'low-rating';

export function getCartIneligibilityReason(
  product: Pick<Product, 'stock' | 'rating'>,
): CartIneligibilityReason | null {
  if (product.stock <= 0) return 'out-of-stock';
  if (product.rating < MIN_RATING_FOR_CART) return 'low-rating';
  return null;
}

export function describeCartIneligibility(reason: CartIneligibilityReason): string {
  switch (reason) {
    case 'out-of-stock':
      return 'Out of stock';
    case 'low-rating':
      return 'Rating too low to add';
  }
}

export function maxQuantityInCart(product: Pick<Product, 'stock'>): number {
  return Math.max(0, product.stock);
}