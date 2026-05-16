import React from 'react';
import { Screen, EmptyState } from '@shared/components';

export function CartScreen() {
  return (
    <Screen>
      <EmptyState title="Cart" description="Your shopping cart lives here." />
    </Screen>
  );
}