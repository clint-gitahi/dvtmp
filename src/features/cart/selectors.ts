import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';
import type { CartItem } from './slice';

export const BULK_DISCOUNT_THRESHOLD = 5000;
export const BULK_DISCOUNT_RATE = 0.1;

export const selectCartItems = (state: RootState): CartItem[] => state.cart.items;

export const selectCartCount = createSelector([selectCartItems], items =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export function lineTotal(item: CartItem): number {
  const { price, discountPercentage } = item.snapshot;
  const unit = price * (1 - discountPercentage / 100);
  return unit * item.quantity;
}

export const selectSubtotal = createSelector([selectCartItems], items =>
  items.reduce((sum, item) => sum + lineTotal(item), 0),
);

export const selectIsBulkEligible = createSelector(
  [selectSubtotal],
  subtotal => subtotal > BULK_DISCOUNT_THRESHOLD,
);

export const selectDiscountAmount = createSelector(
  [selectSubtotal, selectIsBulkEligible],
  (subtotal, eligible) => (eligible ? subtotal * BULK_DISCOUNT_RATE : 0),
);

export const selectFinalTotal = createSelector(
  [selectSubtotal, selectDiscountAmount],
  (subtotal, discount) => subtotal - discount,
);

export const selectCartTotals = createSelector(
  [selectSubtotal, selectDiscountAmount, selectFinalTotal, selectIsBulkEligible],
  (subtotal, discount, total, eligible) => ({ subtotal, discount, total, eligible }),
);

export const selectCartItemById = (productId: number) =>
  createSelector([selectCartItems], items => items.find(i => i.productId === productId));