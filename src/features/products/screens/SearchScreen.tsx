import React from 'react';
import { Screen, EmptyState } from '@shared/components';

export function SearchScreen() {
  return (
    <Screen>
      <EmptyState title="Search" description="Search and filters live here." />
    </Screen>
  );
}