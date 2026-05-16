import React from 'react';
import { Screen, EmptyState } from '@shared/components';

export function CartScreen() {
  return (
    <Screen>
      <EmptyState title="Cart" description="Add Product for a great experience" />
    </Screen>
  );
}