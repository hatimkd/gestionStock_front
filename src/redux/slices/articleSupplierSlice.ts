import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ArticleSupplier {
  id: number;
  article_id: number;
  supplier_id: number;
  supplier_reference: string;
  supplier_price: string;
  is_preferred: boolean;
  created_at: string;
}

interface ArticleSupplierState {
  articleSuppliers: ArticleSupplier[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ArticleSupplierState = {
  articleSuppliers: [],
  isLoading: false,
  error: null,
};

const articleSupplierSlice = createSlice({
  name: 'articleSuppliers',
  initialState,
  reducers: {
    setArticleSuppliers: (state, action: PayloadAction<ArticleSupplier[]>) => {
      state.articleSuppliers = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Actions exportées
export const { setArticleSuppliers, setLoading, setError } = articleSupplierSlice.actions;

// Sélecteur pour récupérer les articles fournisseurs
export const selectArticleSuppliers = (state: RootState) => state.articleSuppliers.articleSuppliers;

// Export du reducer
export default articleSupplierSlice.reducer;
