import { apiSlice } from './apiSlice';
import { Order } from '../slices/ordersSlice';

interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

interface OrdersQueryParams {
  page?: number;
  page_size?: number;
  status?: string;
  supplier?: number;
  search?: string;
  ordering?: string;
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, OrdersQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });

        return {
          url: `/orders/${searchParams.toString() ? `?${searchParams}` : ''}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order' as const, id: 'LIST' },
            ]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),

    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    getOrder: builder.query({
      query: () => '/order/',
      providesTags: (result, error) => [{ type: 'Order' }],
    }),

    addOrder: builder.mutation<Order, Partial<Order>>({
      query: (newOrder) => ({
        url: '/orders/',
        method: 'POST',
        body: newOrder,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    updateOrder: builder.mutation<Order, Partial<Order>>({
      query: (order) => ({
        url: `/orders/${order.id}/`,
        method: 'PUT',
        body: order,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    updateOrderStatus: builder.mutation<Order, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    // Endpoints spécifiques aux commandes
    confirmOrder: builder.mutation<Order, number>({
      query: (id) => ({
        url: `/orders/${id}/confirm/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    cancelOrder: builder.mutation<Order, number>({
      query: (id) => ({
        url: `/orders/${id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    receiveOrder: builder.mutation<Order, { id: number; items: Array<{ id: number; quantity_received: number }> }>({
      query: ({ id, items }) => ({
        url: `/orders/${id}/receive/`,
        method: 'POST',
        body: { items },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    // Statistiques des commandes
    getOrdersStats: builder.query<{
      total_orders: number;
      pending_orders: number;
      delivered_orders: number;
      cancelled_orders: number;
      total_amount: string;
    }, void>({
      query: () => '/orders/stats/',
      providesTags: [{ type: 'Order', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useConfirmOrderMutation,
  useCancelOrderMutation,
  useReceiveOrderMutation,
  useGetOrdersStatsQuery,
} = ordersApi;