import { apiSlice } from './apiSlice';
import { setCredentials, setUser } from '../slices/authSlice';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          }));

          // Ensuite récupérer les données utilisateur
          const userData = await dispatch(
            authApi.endpoints.getUserInfo.initiate()
          ).unwrap();

          dispatch(setUser(userData));
        } catch (err) {
          console.error('Erreur login:', err);
        }
      },
    }),

    getUserInfo: builder.query<User, void>({
      query: () => '/me/',
      providesTags: ['User'],
    }),
    getFournisseurs: builder.query<User[], void>({
      query: () => '/users-f/',
      providesTags: [{ type: 'Fournisseur', id: 'LIST' }],
    }),
  }),
});

export const { useLoginMutation, useGetUserInfoQuery,useGetFournisseursQuery } = authApi;
