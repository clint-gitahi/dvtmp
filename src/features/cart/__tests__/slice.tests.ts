import {
  addItem,
  cartReducer,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  type CartState,
} from '@features/cart/slice';
import type { Product } from '@models/Product';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Test Product',
    description: '',
    category: 'general',
    price: 100,
    discountPercentage: 0,
    rating: 4,
    stock: 10,
    thumbnail: '',
    images: [],
    ...overrides,
  };
}

const empty: CartState = { items: [] };

describe('cart slice — addItem', () => {
  it('inserts a new item with the requested quantity', () => {
    const state = cartReducer(empty, addItem(makeProduct({ id: 7 }), 2));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ productId: 7, quantity: 2 });
  });

  it('clamps quantity to available stock on insert', () => {
    const state = cartReducer(empty, addItem(makeProduct({ stock: 5 }), 100));
    expect(state.items[0].quantity).toBe(5);
  });

  it('refuses to add a product that fails canAddToCart (rating < 3)', () => {
    const state = cartReducer(empty, addItem(makeProduct({ rating: 2 }), 1));
    expect(state.items).toHaveLength(0);
  });

  it('refuses to add an out-of-stock product', () => {
    const state = cartReducer(empty, addItem(makeProduct({ stock: 0 }), 1));
    expect(state.items).toHaveLength(0);
  });

  it('merges into an existing line and clamps the total at stock', () => {
    const product = makeProduct({ id: 1, stock: 5 });
    let state = cartReducer(empty, addItem(product, 3));
    state = cartReducer(state, addItem(product, 10));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(5);
  });

  it('refreshes the stored snapshot on re-add (price/stock may have changed)', () => {
    const initial = makeProduct({ id: 1, stock: 10, price: 100 });
    let state = cartReducer(empty, addItem(initial, 1));
    const updated = makeProduct({ id: 1, stock: 10, price: 90 });
    state = cartReducer(state, addItem(updated, 1));
    expect(state.items[0].snapshot.price).toBe(90);
  });
});

describe('cart slice — increaseQuantity', () => {
  it('increments by one', () => {
    let state = cartReducer(empty, addItem(makeProduct({ id: 1, stock: 5 }), 1));
    state = cartReducer(state, increaseQuantity(1));
    expect(state.items[0].quantity).toBe(2);
  });

  it('refuses to exceed the snapshot stock cap', () => {
    let state = cartReducer(empty, addItem(makeProduct({ id: 1, stock: 2 }), 2));
    state = cartReducer(state, increaseQuantity(1));
    expect(state.items[0].quantity).toBe(2);
  });

  it('is a no-op for a missing product id', () => {
    const state = cartReducer(empty, increaseQuantity(999));
    expect(state.items).toHaveLength(0);
  });
});

describe('cart slice — decreaseQuantity', () => {
  it('decrements by one', () => {
    let state = cartReducer(empty, addItem(makeProduct({ id: 1, stock: 5 }), 3));
    state = cartReducer(state, decreaseQuantity(1));
    expect(state.items[0].quantity).toBe(2);
  });

  it('removes the item when its quantity reaches zero', () => {
    let state = cartReducer(empty, addItem(makeProduct({ id: 1, stock: 5 }), 1));
    state = cartReducer(state, decreaseQuantity(1));
    expect(state.items).toHaveLength(0);
  });
});

describe('cart slice — removeItem / clearCart', () => {
  it('removeItem removes only the matching product id', () => {
    let state = cartReducer(empty, addItem(makeProduct({ id: 1, stock: 5 }), 1));
    state = cartReducer(state, addItem(makeProduct({ id: 2, stock: 5 }), 1));
    state = cartReducer(state, removeItem(1));
    expect(state.items.map(i => i.productId)).toEqual([2]);
  });

  it('clearCart empties the items list', () => {
    let state = cartReducer(empty, addItem(makeProduct({ id: 1 }), 1));
    state = cartReducer(state, addItem(makeProduct({ id: 2 }), 1));
    state = cartReducer(state, clearCart());
    expect(state.items).toEqual([]);
  });
});