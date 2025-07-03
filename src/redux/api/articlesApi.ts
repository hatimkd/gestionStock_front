import { apiSlice } from './apiSlice';
import { Article } from '../slices/articleSlice';

export const articlesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<{ results: Article[]; count: number }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/articles/',
        params: { page },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: 'Article' as const, id })),
            { type: 'Article' as const, id: 'LIST' },
          ]
          : [{ type: 'Article' as const, id: 'LIST' }],
    }),
    getArticleById: builder.query<Article, number>({
      query: (id) => `/articles/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Article', id }],
    }),

    getArticle: builder.query({
      query: () => '/article/', // l’URL relative
      providesTags: (result, error) => [{ type: 'Article' }],
    }),
    addArticle: builder.mutation<Article, Partial<Article>>({
      query: (newArticle) => ({
        url: '/articles/',
        method: 'POST',
        body: newArticle,
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),

    updateArticle: builder.mutation<Article, Partial<Article>>({
      query: (article) => ({
        url: `/articles/${article.id}/`,
        method: 'PUT',
        body: article,
      }),
    // updateArticle: builder.mutation<Article, Partial<Article> & { id: number }>({
    //   query: ({ id, ...patch }) => ({
    //     url: `/articles/${id}/`,
    //     method: 'PATCH',
    //     body: patch,
    //   }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Article', id },
        { type: 'Article', id: 'LIST' },
      ],
    }),

    deleteArticle: builder.mutation<void, number>({
      query: (id) => ({
        url: `/articles/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Article', id },
        { type: 'Article', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetArticleQuery
} = articlesApi;
