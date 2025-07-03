import { apiSlice } from './apiSlice';
import { User, Group } from '../slices/userSlice';

interface UsersResponse {
  users: User[];
  total: number;
}

interface GroupsResponse {
  groups: Group[];
  total: number;
}

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_staff?: boolean;
  groups?: number[];
}

interface AssignRolesData {
  user_id: number;
  roles: string[];
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => '/me/',
      providesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    // Get all users (admin only)
    getUsers: builder.query<User[], void>({
      query: () => '/users/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User' as const, id: 'LIST' },
            ]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    // Get users with admin endpoint
    getUsersAdmin: builder.query<UsersResponse, void>({
      query: () => '/admin/users/',
      providesTags: [{ type: 'User', id: 'ADMIN_LIST' }],
    }),

    // Get groups
    getGroups: builder.query<GroupsResponse, void>({
      query: () => '/admin/groups/',
      providesTags: [{ type: 'Group', id: 'LIST' }],
    }),

    // Create user
    createUser: builder.mutation<{ message: string; user: User }, CreateUserData>({
      query: (userData) => ({
        url: '/admin/create-user/',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'ADMIN_LIST' },
      ],
    }),

    // Assign roles
    assignRoles: builder.mutation<{ message: string; user: User }, AssignRolesData>({
      query: (roleData) => ({
        url: '/admin/assign-roles/',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: (result, error, { user_id }) => [
        { type: 'User', id: user_id },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'ADMIN_LIST' },
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<{ message: string }, number>({
      query: (userId) => ({
        url: `/admin/delete-user/${userId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'ADMIN_LIST' },
      ],
    }),

    // Get fournisseurs
    getFournisseurs: builder.query<User[], void>({
      query: () => '/fournisseurs/',
      providesTags: [{ type: 'User', id: 'FOURNISSEURS' }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useGetUsersAdminQuery,
  useGetGroupsQuery,
  useCreateUserMutation,
  useAssignRolesMutation,
  useDeleteUserMutation,
  useGetFournisseursQuery,
} = userApi;