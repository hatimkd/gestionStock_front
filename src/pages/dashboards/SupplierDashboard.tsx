import { useEffect, useState } from 'react';
import { useGetArticlesQuery } from '../../redux/api/articlesApi';
import { PackageOpen, AlertTriangle, TruckIcon, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SupplierDashboard = () => {
  const { data: articlesData, isLoading } = useGetArticlesQuery({ limit: 100 });
  const [criticalItems, setCriticalItems] = useState<any[]>([]);
  
  useEffect(() => {
    if (articlesData?.results) {
      // Get critical items that need resupplying
      const critical = articlesData.results
        .filter(article => article.is_critical)
        .sort((a, b) => (a.quantity / a.critical_threshold) - (b.quantity / b.critical_threshold));
      
      setCriticalItems(critical);
    }
  }, [articlesData]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Supplier Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Monitor stock levels and view items that need to be resupplied.
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Critical Items Stats */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-error-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <AlertTriangle className="h-6 w-6 text-error-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Critical Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {criticalItems.length}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(criticalItems.length / (articlesData?.results?.length || 1)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {articlesData?.results ? 
                `${((criticalItems.length / articlesData.results.length) * 100).toFixed(1)}% of inventory needs attention` : 
                'Loading...'
              }
            </p>
          </div>
        </div>
        
        {/* Total Supply Value */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 mr-4">
              <TruckIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Supply Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${articlesData?.results ? 
                  articlesData.results.reduce((sum, item) => 
                    sum + (parseFloat(item.unit_price) * item.quantity), 0).toFixed(2) :
                  '0.00'
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Supply Performance */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 mr-4">
              <BarChart3 className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Average Stock Level</p>
              <p className="text-2xl font-semibold text-gray-900">
                {articlesData?.results ? 
                  `${Math.round(articlesData.results.reduce((sum, item) => 
                    sum + ((item.quantity / Math.max(item.critical_threshold, 1)) * 100), 0) / 
                    (articlesData.results.length || 1))}%` :
                  '0%'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Critical Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Items Needing Resupply</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Priority Items
          </span>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : criticalItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Critical Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {criticalItems.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                          {article.image ? (
                            <img src={article.image} alt={article.name} className="h-full w-full object-cover" />
                          ) : (
                            <PackageOpen className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/dashboard/articles/${article.id}`} className="hover:text-primary-600">
                              {article.name}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500">ID: {article.reference.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{article.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{article.critical_threshold}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${article.unit_price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {article.quantity === 0 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Out of stock
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Low stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No critical items</h3>
            <p className="mt-1 text-sm text-gray-500">
              All inventory items are above their critical threshold.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;