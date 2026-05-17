import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SortKey } from '@models/Product';

export type FiltersState = {
  category: string | null;
  sort: SortKey | null;
};

const initialState: FiltersState = {
  category: null,
  sort: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string | null>) {
      state.category = action.payload;
    },
    setSort(state, action: PayloadAction<SortKey | null>) {
      state.sort = action.payload;
    },
    clearFilters(state) {
      state.category = null;
      state.sort = null;
    },
  },
});

export const { setCategory, setSort, clearFilters } = filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;