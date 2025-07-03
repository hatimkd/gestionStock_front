import { useState, useEffect } from 'react';
import { X, Shield, User } from 'lucide-react';
import { useAssignRolesMutation } from '../../redux/api/userApi';
import { User as UserType } from '../../redux/slices/userSlice';

interface AssignRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSuccess: () => void;
}

const AssignRolesModal = ({ isOpen, onClose, user, onSuccess }: AssignRolesModalProps) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [assignRoles, { isLoading, error }] = useAssignRolesMutation();

  useEffect(() => {
    if (user) {
      setSelectedRole(user.roles);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      await assignRoles({
        user_id: user.id,
        roles: [selectedRole]
      }).unwrap();
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erreur lors de l\'assignation des rôles:', err);
    }
  };

  if (!isOpen || !user) return null;

  const roleOptions = [
    { value: 'admin', label: 'Admin', color: 'text-red-600' },
    { value: 'gestionnaire', label: 'Gestionnaire', color: 'text-blue-600' },
    { value: 'fournisseur', label: 'Fournisseur', color: 'text-green-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Modifier les rôles</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="font-medium text-gray-900">
                {user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user.username
                }
              </span>
            </div>
            <p className="text-sm text-gray-600">@{user.username}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {typeof error === 'object' && 'data' in error 
                ? JSON.stringify(error.data) 
                : 'Erreur lors de l\'assignation des rôles'
              }
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Shield className="inline h-4 w-4 mr-1" />
              Sélectionner un rôle
            </label>
            
            <div className="space-y-3">
              {roleOptions.map((role) => (
                <label key={role.value} className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className={`ml-3 text-sm font-medium ${role.color}`}>
                    {role.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Permissions par rôle:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li><strong>Admin:</strong> Accès complet au système</li>
              <li><strong>Gestionnaire:</strong> Gestion des commandes et stocks</li>
              <li><strong>Fournisseur:</strong> Consultation des commandes qui lui sont attribuées</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedRole === user.roles}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRolesModal;