import React from 'react';
import { Screen } from '@shared/components';
import { EmptyState } from '@shared/components';

export function HomeScreen() {
  return (
    <Screen>
      <EmptyState title="Home" description="Product feed lives here." />
    </Screen>
  );
}