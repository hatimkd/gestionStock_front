import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Shield, 
  Mail, 
  User as UserIcon, 
  AlertCircle, 
  Loader2,
  Trash2,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../redux/api/userApi';
import CreateUserModal from './CreateUserModal';
import AssignRolesModal from './AssignRolesModal';
import { User } from '../../redux/slices/userSlice';

const UsersList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'gestionnaire':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fournisseur':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleUserCreated = () => {
    refetch();
  };

  const handleRolesUpdated = () => {
    refetch();
  };

  const handleEditRoles = (user: User) => {
    setSelectedUser(user);
    setIsRolesModalOpen(true);
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}" ?`)) {
      try {
        await deleteUser(userId).unwrap();
        refetch();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Erreur lors du chargement des utilisateurs</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Utilisateurs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérer les utilisateurs et leurs rôles
          </p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Nouvel Utilisateur
        </button>
      </div>

      {users && users.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UserIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : user.username
                          }
                        </h3>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRoles(user)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Modifier les rôles"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      {user.roles !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="flex-shrink-0 mr-2 h-4 w-4" />
                      {user.email}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Shield className="flex-shrink-0 mr-2 h-4 w-4" />
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.roles)}`}
                        >
                          {user.roles}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        {user.is_active !== false ? (
                          <CheckCircle className="h-5 w-5 text-green-500" title="Actif" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" title="Inactif" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
          <p className="mt-1 text-sm text-gray-500">Commencez par créer un nouvel utilisateur.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Nouvel Utilisateur
            </button>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleUserCreated}
      />

      {/* Assign Roles Modal */}
      <AssignRolesModal
        isOpen={isRolesModalOpen}
        onClose={() => {
          setIsRolesModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={handleRolesUpdated}
      />
    </div>
  );
};

export default UsersList;