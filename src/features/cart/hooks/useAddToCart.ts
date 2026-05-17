import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAppDispatch } from '@shared/hooks/redux';
import { addItem } from '@features/cart/slice';
import {
  canAddToCart,
  describeCartIneligibility,
  getCartIneligibilityReason,
} from '@features/products/businessRules';
import type { Product } from '@models/Product';

export function useAddToCart() {
  const dispatch = useAppDispatch();

  return useCallback(
    (product: Product) => {
      if (!canAddToCart(product)) {
        const reason = getCartIneligibilityReason(product);
        if (reason) {
          Alert.alert('Unfortunately, Cannot add to cart', describeCartIneligibility(reason));
        }
        return;
      }
      dispatch(addItem(product, 1));
    },
    [dispatch],
  );
}