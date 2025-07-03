import { useEffect, useState } from 'react';
import { useGetArticlesQuery } from '../../redux/api/articlesApi';
import { useGetCategoriesQuery } from '../../redux/api/categoriesApi';
import { BarChart3, PackageOpen, AlertTriangle, Tag } from 'lucide-react';

const ManagerDashboard = ({role}) => {
  const { data: articlesData, isLoading: articlesLoading } = useGetArticlesQuery({ limit: 100 });
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

  const [stats, setStats] = useState({
    totalArticles: 0,
    totalCategories: 0,
    criticalStock: 0,
    totalValue: 0,
  });

 
  

  useEffect(() => {
    
  const articlesList = Array.isArray(articlesData?.results) ? articlesData.results : [];
  const categoriesCount = typeof categories?.count === 'number' ? categories.count : 0;

  const criticalItems = articlesList.filter(article => article.is_critical).length;

  const totalInventoryValue = articlesList.reduce((sum, article) => {
    const price = parseFloat(article.unit_price) || 0;
    const quantity = typeof article.quantity === 'number' ? article.quantity : 0;
    return sum + price * quantity;
  }, 0);

  setStats({
    totalArticles: typeof articlesData?.count === 'number' ? articlesData.count : articlesList.length,
    totalCategories: categoriesCount,
    criticalStock: criticalItems,
    totalValue: totalInventoryValue,
  });
}, [articlesData, categories]);

  // if (articlesLoading || categoriesLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{role} Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your inventory.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Articles */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 mr-4">
              <PackageOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Articles</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalArticles}</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 mr-4">
              <Tag className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        {/* Critical Stock */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-error-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <AlertTriangle className="h-6 w-6 text-error-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Critical Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.criticalStock}</p>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-accent-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 mr-4">
              <BarChart3 className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Critical Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900">Recent Articles</h2>
          </div>
          <div className="p-6">
            {articlesData && articlesData.results?.length > 0 ? (
              <div className="space-y-4">
                {articlesData.results.slice(0, 5).map(article => (
                  <div
                    key={article.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                      {article.image ? (
                        <img src={article.image} alt={article.name} className="h-full w-full object-cover" />
                      ) : (
                        <PackageOpen className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{article.name}</p>
                        <p className="text-sm text-gray-500">${article.unit_price}</p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">Qty: {article.quantity}</p>
                        <p className="text-xs text-gray-500">Ref: {article.reference?.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent articles found.</p>
            )}
          </div>
        </div>

        {/* Critical Stock Items */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900">Critical Stock Items</h2>
          </div>
          <div className="p-6">
            {articlesData && articlesData.results?.some(a => a.is_critical) ? (
              <div className="space-y-4">
                {articlesData.results
                  .filter(article => article.is_critical)
                  .slice(0, 5)
                  .map(article => (
                    <div key={article.id} className="flex items-center p-3 bg-red-50 rounded-lg">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md bg-red-100 flex items-center justify-center overflow-hidden">
                        {article.image ? (
                          <img src={article.image} alt={article.name} className="h-full w-full object-cover" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{article.name}</p>
                          <p className="text-sm font-medium text-red-600">
                            {article.quantity} / {article.critical_threshold}
                          </p>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs text-gray-500">
                            {article.quantity === 0
                              ? 'Out of stock'
                              : `Low stock - ${article.quantity} remaining`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <PackageOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No critical items</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All your inventory items are above critical threshold.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
