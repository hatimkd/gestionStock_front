import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';
import authReducer from './slices/authSlice';
import articleReducer from './slices/articleSlice';
import categoryReducer from './slices/categorySlice';

import stockMovementReducer from './slices/stockMovementSlice'; // ✅ Import du slice

import articleSupplierReducer from './slices/articleSupplierSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    articles: articleReducer,
    categories: categoryReducer,
        articleSupplier: articleSupplierReducer, // 👈 Ajouter ici

    stockMovements: stockMovementReducer, // ✅ Ajout du reducer ici


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;