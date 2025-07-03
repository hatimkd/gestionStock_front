// import { apiSlice } from './apiSlice';
// import { Category } from '../slices/categorySlice';

// export const categoriesApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getCategories: builder.query<Category[], void>({
//       query: () => '/categories/',
//       providesTags: (result) =>
//         result
//           ? [
//             ...result.map(({ id }) => ({ type: 'Category' as const, id })),
//             { type: 'Category' as const, id: 'LIST' }
//           ]
//           : [{ type: 'Category' as const, id: 'LIST' }],
//     }),
//     getCategoryById: builder.query<Category, number>({
//       query: (id) => `/categories/${id}/`,
//       providesTags: (_, __, id) => [{ type: 'Category', id }],
//     }),
//     addCategory: builder.mutation<Category, Partial<Category>>({
//       query: (newCategory) => ({
//         url: '/categories/',
//         method: 'POST',
//         body: newCategory,
//       }),
//       invalidatesTags: [{ type: 'Category', id: 'LIST' }],
//     }),
//     updateCategory: builder.mutation<Category, Partial<Category>>({
//       query: (updatedCategory) => ({
//         url: `/categories/${updatedCategory.id}/`,
//         method: 'PUT',
//         body: updatedCategory,
//       }),
//       invalidatesTags: (_, __, arg) => [
//         { type: 'Category', id: arg.id },
//         { type: 'Category', id: 'LIST' }
//       ],
//     }),
//     deleteCategory: builder.mutation<void, number>({
//       query: (id) => ({
//         url: `/categories/${id}/`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: [{ type: 'Category', id: 'LIST' }],
//     }),
//   }),
// });

// export const {
//   useGetCategoriesQuery,
//   useGetCategoryByIdQuery,
//   useAddCategoryMutation,
//   useUpdateCategoryMutation,
//   useDeleteCategoryMutation,
// } = categoriesApi;



// redux/api/categoriesApi.ts
import { apiSlice } from './apiSlice';

export interface Category {
  id: number;
  name: string;
  description: string;
}

interface CategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

interface CategoryCreate {
  name: string;
  description: string;
}

interface CategoryUpdate {
  id: number;
  name: string;
  description: string;
}

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => 'categories/',
      // transformResponse: (response: CategoriesResponse) => response.results,
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<Category, number>({
      query: (id) => `categories/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    addCategory: builder.mutation<Category, CategoryCreate>({
      query: (newCategory) => ({
        url: 'categories/',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<Category, CategoryUpdate>({
      query: ({ id, ...patch }) => ({
        url: `categories/${id}/`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),
    deleteCategory: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `categories/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;