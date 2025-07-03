import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectCurrentUser, setUser, logout } from '../redux/slices/authSlice';
import { useGetUserInfoQuery } from '../redux/api/authApi'; // ton RTK query
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Requête pour récupérer les infos user
  const { data: userData, isLoading, isError } = useGetUserInfoQuery(undefined, {
    skip: !!user, // skip si user déjà en state
  });

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (isError) {
      // Token invalide, on logout et redirige vers login
      dispatch(logout());
      navigate('/login');
    }
  }, [isError, dispatch, navigate]);

  useEffect(() => {
    if (user) {
      switch (user.roles) {
        case 'gestionnaire':
          navigate('/dashboard/manager');
          break;
        case 'employee':
          navigate('/dashboard/employee');
          break;
        case 'fournisseur':
          navigate('/dashboard/supplier');
          break;
        default:
          navigate('/dashboard/admin');
      }
    }
  }, [user, navigate]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return null; // Ou un fallback, car on devrait être redirigé
};

export default Dashboard;
