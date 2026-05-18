import {
  BULK_DISCOUNT_RATE,
  BULK_DISCOUNT_THRESHOLD,
  lineTotal,
  selectCartCount,
  selectCartTotals,
  selectDiscountAmount,
  selectFinalTotal,
  selectIsBulkEligible,
  selectSubtotal,
} from '@features/cart/selectors';
import type { CartItem, CartItemSnapshot } from '@features/cart/slice';
import type { RootState } from '@app/store';

function makeSnapshot(overrides: Partial<CartItemSnapshot> = {}): CartItemSnapshot {
  return {
    id: 1,
    title: 'Item',
    thumbnail: '',
    price: 100,
    discountPercentage: 0,
    rating: 4,
    stock: 100,
    brand: 'Acme',
    category: 'general',
    ...overrides,
  };
}

function makeItem(overrides: Partial<CartItem> & { snapshot?: Partial<CartItemSnapshot> }): CartItem {
  const snapshot = makeSnapshot(overrides.snapshot);
  return {
    productId: snapshot.id,
    quantity: 1,
    ...overrides,
    snapshot,
  };
}

function stateWithItems(items: CartItem[]): RootState {
  return { cart: { items } } as unknown as RootState;
}

describe('lineTotal', () => {
  it('multiplies the discounted unit price by quantity', () => {
    const item = makeItem({
      quantity: 3,
      snapshot: { price: 100, discountPercentage: 20 },
    });
    // 100 * 0.80 = 80; 80 * 3 = 240
    expect(lineTotal(item)).toBeCloseTo(240, 5);
  });

  it('returns 0 when quantity is 0', () => {
    const item = makeItem({ quantity: 0, snapshot: { price: 100 } });
    expect(lineTotal(item)).toBe(0);
  });
});

describe('selectCartCount', () => {
  it('sums quantities across all items', () => {
    const state = stateWithItems([
      makeItem({ productId: 1, quantity: 2, snapshot: { id: 1 } }),
      makeItem({ productId: 2, quantity: 5, snapshot: { id: 2 } }),
    ]);
    expect(selectCartCount(state)).toBe(7);
  });

  it('is 0 for an empty cart', () => {
    expect(selectCartCount(stateWithItems([]))).toBe(0);
  });
});

describe('selectSubtotal', () => {
  it('aggregates line totals, honoring per-item discounts', () => {
    const state = stateWithItems([
      makeItem({ productId: 1, quantity: 2, snapshot: { id: 1, price: 50, discountPercentage: 0 } }),  // 100
      makeItem({ productId: 2, quantity: 1, snapshot: { id: 2, price: 200, discountPercentage: 25 } }), // 150
    ]);
    expect(selectSubtotal(state)).toBeCloseTo(250, 5);
  });
});

describe('Rule D — bulk discount thresholds', () => {
  it('exposes thresholds matching the spec', () => {
    expect(BULK_DISCOUNT_THRESHOLD).toBe(5000);
    expect(BULK_DISCOUNT_RATE).toBe(0.1);
  });

  it('is NOT eligible at exactly $5000 (spec uses strict greater-than)', () => {
    const state = stateWithItems([
      makeItem({ quantity: 1, snapshot: { price: 5000 } }),
    ]);
    expect(selectSubtotal(state)).toBe(5000);
    expect(selectIsBulkEligible(state)).toBe(false);
    expect(selectDiscountAmount(state)).toBe(0);
    expect(selectFinalTotal(state)).toBe(5000);
  });

  it('IS eligible just above $5000', () => {
    const state = stateWithItems([
      makeItem({ quantity: 1, snapshot: { price: 5000.01 } }),
    ]);
    expect(selectIsBulkEligible(state)).toBe(true);
    expect(selectDiscountAmount(state)).toBeCloseTo(500.001, 4);
    expect(selectFinalTotal(state)).toBeCloseTo(4500.009, 4);
  });

  it('applies 10% off when subtotal is well above the threshold', () => {
    const state = stateWithItems([
      makeItem({ quantity: 1, snapshot: { price: 10000 } }),
    ]);
    expect(selectSubtotal(state)).toBe(10000);
    expect(selectIsBulkEligible(state)).toBe(true);
    expect(selectDiscountAmount(state)).toBe(1000);
    expect(selectFinalTotal(state)).toBe(9000);
  });
});

describe('selectCartTotals', () => {
  it('returns subtotal / discount / total / eligible in one shot', () => {
    const state = stateWithItems([
      makeItem({ quantity: 1, snapshot: { price: 6000 } }),
    ]);
    const totals = selectCartTotals(state);
    expect(totals).toEqual({
      subtotal: 6000,
      discount: 600,
      total: 5400,
      eligible: true,
    });
  });

  it('memoizes (identical state returns the same reference)', () => {
    const state = stateWithItems([
      makeItem({ quantity: 1, snapshot: { price: 100 } }),
    ]);
    const first = selectCartTotals(state);
    const second = selectCartTotals(state);
    expect(second).toBe(first);
  });
});