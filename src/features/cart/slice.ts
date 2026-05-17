import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@models/Product';
import { canAddToCart, maxQuantityInCart } from '@features/products/businessRules';

export type CartItemSnapshot = Pick<
  Product,
  | 'id'
  | 'title'
  | 'thumbnail'
  | 'price'
  | 'discountPercentage'
  | 'rating'
  | 'stock'
  | 'brand'
  | 'category'
>;

export type CartItem = {
  productId: number;
  quantity: number;
  snapshot: CartItemSnapshot;
};

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

function toSnapshot(product: Product): CartItemSnapshot {
  return {
    id: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    stock: product.stock,
    brand: product.brand,
    category: product.category,
  };
}

function clampQty(qty: number, max: number): number {
  if (!Number.isFinite(qty) || qty < 0) return 0;
  return Math.min(Math.floor(qty), max);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: {
      reducer(state, action: PayloadAction<{ product: Product; quantity: number }>) {
        const { product, quantity } = action.payload;
        if (!canAddToCart(product)) return;
        const max = maxQuantityInCart(product);
        const existing = state.items.find(i => i.productId === product.id);
        if (existing) {
          existing.quantity = clampQty(existing.quantity + quantity, max);
          existing.snapshot = toSnapshot(product);
        } else {
          const initialQty = clampQty(quantity, max);
          if (initialQty <= 0) return;
          state.items.push({
            productId: product.id,
            quantity: initialQty,
            snapshot: toSnapshot(product),
          });
        }
      },
      prepare(product: Product, quantity = 1) {
        return { payload: { product, quantity } };
      },
    },
    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(i => i.productId === action.payload);
      if (!item) return;
      const max = maxQuantityInCart(item.snapshot);
      item.quantity = clampQty(item.quantity + 1, max);
    },
    decreaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(i => i.productId === action.payload);
      if (!item) return;
      const next = item.quantity - 1;
      if (next <= 0) {
        state.items = state.items.filter(i => i.productId !== action.payload);
        return;
      }
      item.quantity = next;
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.productId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, increaseQuantity, decreaseQuantity, removeItem, clearCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;