import { apiSlice } from './apiSlice';
import { ArticleSupplier } from '../slices/articleSupplierSlice';

export const articleSuppliersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArticleSuppliers: builder.query<
      { count: number; next: string | null; previous: string | null; results: ArticleSupplier[] },
      { page?: number }
    >({
      query: ({ page = 1 } = {}) => `/article-suppliers/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: 'ArticleSupplier' as const, id })),
            { type: 'ArticleSupplier' as const, id: 'LIST' }
          ]
          : [{ type: 'ArticleSupplier' as const, id: 'LIST' }],
    }),
    addArticleSupplier: builder.mutation<ArticleSupplier, Partial<ArticleSupplier>>({
      query: (newArticleSupplier) => ({
        url: '/article-suppliers/',
        method: 'POST',
        body: newArticleSupplier,
      }),
      invalidatesTags: [{ type: 'ArticleSupplier', id: 'LIST' }],
    }),
    updateArticleSupplier: builder.mutation<ArticleSupplier, Partial<ArticleSupplier>>({
      query: (updatedArticleSupplier) => ({
        url: `/article-suppliers/${updatedArticleSupplier.id}/`,
        method: 'PUT',
        body: updatedArticleSupplier,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: 'ArticleSupplier', id: arg.id },
        { type: 'ArticleSupplier', id: 'LIST' }
      ],
    }),
    deleteArticleSupplier: builder.mutation<void, number>({
      query: (id) => ({
        url: `/article-suppliers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ArticleSupplier', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetArticleSuppliersQuery,
  useAddArticleSupplierMutation,
  useUpdateArticleSupplierMutation,
  useDeleteArticleSupplierMutation,
} = articleSuppliersApi;
