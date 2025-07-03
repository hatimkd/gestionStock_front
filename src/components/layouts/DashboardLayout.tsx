import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout, selectCurrentUser } from '../../redux/slices/authSlice';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  BarChart4,
  UsersRoundIcon,
  ListOrderedIcon,
  BellPlusIcon,
  ArrowDownToDotIcon,
  ClipboardCheckIcon,
  ClipboardPlus
} from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const getNavigationItems = () => {
    const items = [
      {
        name: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/dashboard',
        showFor: ['employee', 'gestionnaire' ,'admin'],
      },
      {
        name: 'Articles',
        icon: <Package className="w-5 h-5" />,
        path: '/dashboard/articles',
        showFor: ['employee', 'gestionnaire', 'admin'],
      },
      {
        name: 'Article Fournisseur',
        icon: <Package className="w-5 h-5" />,
        path: '/dashboard/articles-sup',
        showFor: [ 'gestionnaire',"admin"],
      },
      {
        name: 'Commande',
        icon: <ListOrderedIcon className="w-5 h-5" />,
        path: '/dashboard/orders',
        showFor: [ 'gestionnaire'      ,'admin'],
      },
      {
        name: 'Utilisateurs',
        icon: <UsersRoundIcon className="w-5 h-5" />,
        path: '/dashboard/users',
        showFor: [ 'admin'],
      },


      {
        name: 'Mouvement stock',
        icon: <Package className="w-5 h-5" />,
        path: '/dashboard/mv-stock',
        showFor: [ 'gestionnaire'  , 'admin'],
      },
      {
        name: 'Demande article',
        icon: <ClipboardPlus className="w-5 h-5" />,
        path: '/dashboard/dm-article',
        showFor: [ 'gestionnaire'  , 'employee','admin'],
      },
      {
        name: 'Categories',
        icon: <Tag className="w-5 h-5" />,
        path: '/dashboard/categories',
        showFor: ['gestionnaire','admin'],
      },
      {
        name: 'Statistiques',
        icon: <BarChart4 className="w-5 h-5" />,
        path: '/dashboard/statistiques',
        showFor: ['gestionnaire',"admin"],
      },
    ];

    if (!user) return items;
    return items.filter(item => item.showFor.includes(user.roles));
  };
  
  const navItems = getNavigationItems();

  const roleName = user?.roles ? {
    'gestionnaire': 'Manager',
    'employee': 'Employee',
    'fournisseur': 'Supplier',
  }[user.roles] || user.roles : '';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          {/* Close button (mobile only) */}
          <div className="lg:hidden absolute right-0 p-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-primary-600">StockPro</h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
return(
              <a
                key={item.name}
                href={item.path}
   className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-100 text-blue-600 font-semibold'
            : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
        }`}                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </a>
           ) })}
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-500">{roleName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 bg-white shadow">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">StockPro</h1>
            </div>

            {/* User dropdown (visible on large screens) */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-sm focus:outline-none"
              >
                <span className="hidden md:block">{user?.username}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b">
                    Signed in as <span className="font-medium">{user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;