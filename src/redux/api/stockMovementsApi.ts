import { StockMovement } from '../slices/stockMovementSlice';
import { apiSlice } from './apiSlice';



interface RestockRequest {
  id: number;
  article: number;
  quantity_requested: number;
  comment: string;
  requester: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}
export const stockMovementsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockMovements: builder.query<{ results: StockMovement[], count: number }, { page?: number, limit?: number }>({
      query: ({ page = 1}) => ({
        url: '/stock-movements/',
        params: { page },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'StockMovement' as const, id })),
              { type: 'StockMovement' as const, id: 'LIST' }
            ]
          : [{ type: 'StockMovement' as const, id: 'LIST' }],
    }),
    addStockMovement: builder.mutation<StockMovement, Partial<StockMovement>>({
      query: (newMovement) => ({
        url: '/stock-movements/',
        method: 'POST',
        body: newMovement,
      }),
      invalidatesTags: [{ type: 'StockMovement', id: 'LIST' }],
    }),
    getMovementsByArticle: builder.query<StockMovement[], number>({
      query: (articleId) => `/articles/${articleId}/movements/`,
      providesTags: (result, error, articleId) => [{ type: 'StockMovement', id: articleId }],

      
    }),


    // 🚨 GET demandes de réapprovisionnement
    getRestockRequests: builder.query<RestockRequest[], void>({
      query: () => '/restock-requests/',
      providesTags: [{ type: 'StockMovement', id: 'RESTOCK_LIST' }],
    }),

    // ➕ POST nouvelle demande de réapprovisionnement
    addRestockRequest: builder.mutation<RestockRequest, Partial<RestockRequest>>({
      query: (data) => ({
        url: '/restock-requests/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'StockMovement', id: 'RESTOCK_LIST' }],
    }),

    // ✅ Approuver une demande
    approveRestockRequest: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/restock-requests/${id}/approve/`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'StockMovement', id: 'RESTOCK_LIST' }],
    }),

    // ❌ Rejeter une demande
    rejectRestockRequest: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/restock-requests/${id}/reject/`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'StockMovement', id: 'RESTOCK_LIST' }],
    }),
  }),

  // }),
});

export const {
  useGetStockMovementsQuery,
  useAddStockMovementMutation,
  useGetMovementsByArticleQuery,
   useGetRestockRequestsQuery,
  useAddRestockRequestMutation,
  useApproveRestockRequestMutation,
  useRejectRestockRequestMutation,
} = stockMovementsApi;