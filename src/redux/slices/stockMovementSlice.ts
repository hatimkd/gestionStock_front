import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface StockMovement {
  id: number;
  article: number;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reference_document: string;
  user: number;
  created_at: string;
}

interface StockMovementState {
  movements: StockMovement[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: StockMovementState = {
  movements: [],
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
};

const stockMovementSlice = createSlice({
  name: 'stockMovements',
  initialState,
  reducers: {
    setMovements: (state, action: PayloadAction<StockMovement[]>) => {
      state.movements = action.payload;
    },
    setPaginatedMovements: (
      state,
      action: PayloadAction<{ results: StockMovement[]; count: number }>
    ) => {
      state.movements = action.payload.results;
      state.totalPages = Math.ceil(action.payload.count / 10); // si 10 éléments/page
    },
    setMovements: (state, action: PayloadAction<StockMovement[]>) => {
      state.movements = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMovements,
  setCurrentPage,
  setTotalPages,
  setLoading,
  setError,
} = stockMovementSlice.actions;

export const selectAllMovements = (state: RootState) => state.stockMovements.movements;
export const selectCurrentPage = (state: RootState) => state.stockMovements.currentPage;
export const selectTotalPages = (state: RootState) => state.stockMovements.totalPages;
export const selectIsLoading = (state: RootState) => state.stockMovements.isLoading;
export const selectError = (state: RootState) => state.stockMovements.error;

export default stockMovementSlice.reducer;