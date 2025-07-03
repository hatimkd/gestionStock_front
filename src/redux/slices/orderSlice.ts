import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface OrderItem {
  id: number;
  article: number;
  article_name: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_price: string;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  supplier: number;
  supplier_name: string;
  status: string;
  order_date: string;
  expected_delivery_date: string;
  actual_delivery_date: string | null;
  total_amount: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  filters: {
    status?: string;
    supplier?: number;
    search?: string;
    ordering?: string;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  filters: {},
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.totalCount += 1;
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder && state.currentOrder.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    },
    removeOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
      state.totalCount -= 1;
      if (state.currentOrder && state.currentOrder.id === action.payload) {
        state.currentOrder = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<OrderState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.totalCount = 0;
      state.currentPage = 1;
    },
  },
});

// Actions exportées
export const {
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrder,
  removeOrder,
  setLoading,
  setError,
  setTotalCount,
  setCurrentPage,
  setFilters,
  resetFilters,
  clearOrders,
} = ordersSlice.actions;

// Sélecteurs pour récupérer les données
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) => state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrdersTotalCount = (state: RootState) => state.orders.totalCount;
export const selectOrdersCurrentPage = (state: RootState) => state.orders.currentPage;
export const selectOrdersFilters = (state: RootState) => state.orders.filters;

// Sélecteurs dérivés
export const selectOrderById = (state: RootState, orderId: number) =>
  state.orders.orders.find(order => order.id === orderId);

export const selectOrdersByStatus = (state: RootState, status: string) =>
  state.orders.orders.filter(order => order.status === status);

export const selectPendingOrders = (state: RootState) =>
  state.orders.orders.filter(order => order.status === 'pending');

export const selectOrdersCount = (state: RootState) => state.orders.orders.length;

// Export du reducer
export default ordersSlice.reducer;