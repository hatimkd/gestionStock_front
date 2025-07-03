import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLoginMutation } from '../redux/api/authApi';
import { useAppSelector } from '../redux/hooks';
import { selectAuth } from '../redux/slices/authSlice';
import { PackageOpen, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated } = useAppSelector(selectAuth);
  
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/dashboard';

  // Redirection si déjà connecté
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Veuillez renseigner tous les champs');
      return;
    }
    
    try {
      await login({ username, password }).unwrap();
      toast.success('Connexion réussie');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Identifiants invalides' ,error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Logo et en-tête */}
          <div className="p-6 sm:p-8 bg-primary-600 text-white text-center">
            <div className="flex justify-center mb-4">
              <PackageOpen className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold">Bienvenue sur StockPro</h1>
            <p className="mt-2 text-primary-100">Connectez-vous pour accéder à votre tableau de bord</p>
          </div>
          
          {/* Formulaire */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-75"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </div>

              {/* <div className="text-center text-sm text-gray-500 mt-4">
                <p>
                  Comptes de démonstration :
                </p>
                <p className="mt-1">
                  Identifiant : <span className="font-medium">gest1</span> / Mot de passe : <span className="font-medium">password</span> (Gestionnaire)
                </p>
                <p className="mt-1">
                  Identifiant : <span className="font-medium">emp1</span> / Mot de passe : <span className="font-medium">password</span> (Employé)
                </p>
              </div> */}
            </form>
            
            <div className="mt-6 text-center">
              <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;