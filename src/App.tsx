import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { selectAuth, setCredentials, setUser } from './redux/slices/authSlice';
import { authApi } from './redux/api/authApi';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

import ProtectedRoute from './components/auth/ProtectedRoute';
// import ArticleSupplierList from './pages/articles/ArticleSupplierList';
import StockMovements from './pages/articles/StockMovements';
import ArticleSupplierList from './pages/articles/ArticleSupplierList';
import OrdersList from './pages/articles/OrderList';
import OrderDetails from './pages/articles/OrderDetails Component';
import UsersList from './pages/User/UsersList';
import RestockRequestEmployee from './pages/articles/RestockRequestEmployee';
import StatistiquesStock from './pages/articles/StatistiquesStock';

// Lazy-loaded components
const DashboardLayout = lazy(() => import('./components/layouts/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EmployeeDashboard = lazy(() => import('./pages/dashboards/EmployeeDashboard'));
const ManagerDashboard = lazy(() => import('./pages/dashboards/ManagerDashboard'));
const SupplierDashboard = lazy(() => import('./pages/dashboards/SupplierDashboard'));
const ArticlesList = lazy(() => import('./pages/articles/ArticlesList'));
const ArticleDetail = lazy(() => import('./pages/articles/ArticleDetail'));
const CategoriesList = lazy(() => import('./pages/categories/CategoriesList'));

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectAuth);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const refreshToken = localStorage.getItem('refreshToken');

    if (token ) {
      dispatch(setCredentials({
        accessToken: token,
        refreshToken: refreshToken ?? '',
      }));

      dispatch(authApi.endpoints.getUserInfo.initiate())
        .unwrap()
        .then((userData) => {
          dispatch(setUser(userData));
        })
        .catch((error) => {
          console.error('Erreur récupération infos utilisateur :', error);
        });
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Suspense fallback={<div className="text-center py-20">Chargement...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="employee" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="manager" element={
            <ProtectedRoute allowedRoles={['gestionnaire']}>
              <ManagerDashboard role="Manager"/>
            </ProtectedRoute>
          } />
          <Route path="supplier" element={
            <ProtectedRoute allowedRoles={['fournisseur']}>
              <SupplierDashboard />
            </ProtectedRoute>
          } />
          <Route path="articles" element={<ArticlesList />} />
          <Route path="statistiques" element={<StatistiquesStock />} />

          <Route path="admin" element={<ManagerDashboard role="Admin"/>} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="orders/:id" element={<OrderDetails />} />

          <Route path="articles-sup" element={<ArticleSupplierList />} />
          <Route path="mv-stock" element={<StockMovements />} />
          <Route path="dm-article" element={<RestockRequestEmployee />} />


          <Route path="articles/:id" element={<ArticleDetail />} />
          <Route path="categories" element={<CategoriesList />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
