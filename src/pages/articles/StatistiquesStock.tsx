// StatistiquesStock.tsx
import React, { useState, useMemo } from 'react';
import {
  useGetStockMovementsQuery,
} from '../../redux/api/stockMovementsApi';
import {
  useGetArticlesQuery,
} from '../../redux/api/articlesApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';

interface StockMovement {
  article: number;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  created_at: string;
}

interface Article {
  id: number;
  name: string;
  reference: string;
  unit_price: string;
  quantity: number;
  image: string;
  category?: {
    id: number;
    name: string;
    description: string;
  };
  critical_threshold: number;
  is_critical: boolean;
  created_at: string;
}

interface ChartDataItem {
  name: string;
  stock: number;
  entrees: number;
  sorties: number;
  category?: string;
  status: 'normal' | 'low' | 'critical' | 'overstock';
}

interface MovementByDate {
  date: string;
  entrees: number;
  sorties: number;
  net: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316'];

const StatistiquesStock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'categories' | 'trends'>('overview');

  const {
    data: movementData,
    isLoading: isLoadingMovements,
    error: movementError
  } = useGetStockMovementsQuery({});

  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    error: articlesError
  } = useGetArticlesQuery({});

  const calculateStockByArticle = (
    movements: StockMovement[]
  ): Map<number, number> => {
    const stockMap = new Map<number, number>();
    movements.forEach((movement) => {
      const currentStock = stockMap.get(movement.article) || 0;
      let updatedStock = currentStock;
      switch (movement.movement_type) {
        case 'in':
          updatedStock =   movement.quantity;
          break;
        case 'out':
          updatedStock =   movement.quantity;
          break;
        case 'adjustment':
          updatedStock =  movement.quantity;
          break;
        default:
          updatedStock = currentStock;
      }
      stockMap.set(movement.article, updatedStock);
    });
    return stockMap;
  };

  const calculateMovementsByArticle = (
    movements: StockMovement[]
  ): Map<number, { entrees: number; sorties: number }> => {
    const movementsMap = new Map<number, { entrees: number; sorties: number }>();
    movements.forEach((movement) => {
      const current = movementsMap.get(movement.article) || { entrees: 0, sorties: 0 };
      if (movement.movement_type === 'in') {
        current.entrees += movement.quantity;
      } else if (movement.movement_type === 'out') {
        current.sorties += movement.quantity;
      }
      movementsMap.set(movement.article, current);
    });
    return movementsMap;
  };

  const getStockStatus = (stock: number, article: Article): 'normal' | 'low' | 'critical' | 'overstock' => {
    if (article.critical_threshold && stock < article.critical_threshold * 0.5) return 'critical';
    if (article.critical_threshold && stock < article.critical_threshold) return 'low';
    return 'normal';
  };

  const chartData = useMemo(() => {
    if (!movementData?.results || !articlesData?.results) return [];

    const stockMap = calculateStockByArticle(movementData.results);
    const movementsMap = calculateMovementsByArticle(movementData.results);

    return articlesData.results.map((article) => {
      const stock = stockMap.get(article.id) || 0;
      const movements = movementsMap.get(article.id) || { entrees: 0, sorties: 0 };
      return {
        name: article.name,
        stock,
        entrees: movements.entrees,
        sorties: movements.sorties,
        category: article.category?.name || 'Autres',
        status: getStockStatus(stock, article)
      };
    });
  }, [movementData, articlesData]);

  // Données pour le graphique de tendances
  const trendData = useMemo(() => {
    if (!movementData?.results) return [];
    
    const dateMap = new Map<string, { entrees: number; sorties: number }>();
    
    movementData.results.forEach((movement) => {
      const date = new Date(movement.created_at).toLocaleDateString();
      const current = dateMap.get(date) || { entrees: 0, sorties: 0 };
      
      if (movement.movement_type === 'in') {
        current.entrees += movement.quantity;
      } else if (movement.movement_type === 'out') {
        current.sorties += movement.quantity;
      }
      
      dateMap.set(date, current);
    });
    
    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        entrees: data.entrees,
        sorties: data.sorties,
        net: data.entrees - data.sorties
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Derniers 30 jours
  }, [movementData]);

  // Données par catégorie
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    chartData.forEach((item) => {
      const current = categoryMap.get(item.category || 'Autres') || 0;
      categoryMap.set(item.category || 'Autres', current + item.stock);
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [chartData]);

  // Données de statut du stock
  const statusData = useMemo(() => {
    const statusMap = new Map<string, number>();
    
    chartData.forEach((item) => {
      const current = statusMap.get(item.status) || 0;
      statusMap.set(item.status, current + 1);
    });
    
    const statusLabels = {
      normal: 'Normal',
      low: 'Stock faible',
      critical: 'Stock critique',
      overstock: 'Surstock'
    };
    
    return Array.from(statusMap.entries()).map(([status, count]) => ({
      name: statusLabels[status as keyof typeof statusLabels] || status,
      value: count,
      color: status === 'critical' ? '#ef4444' : 
             status === 'low' ? '#f59e0b' : 
             status === 'overstock' ? '#8b5cf6' : '#10b981'
    }));
  }, [chartData]);

  // États de chargement et d'erreur
  if (isLoadingMovements || isLoadingArticles) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">
          Chargement des statistiques...
        </div>
      </div>
    );
  }

  if (movementError || articlesError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Erreur lors du chargement des données
        </div>
      </div>
    );
  }

  if (!movementData?.results || !articlesData?.results) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'movements', label: 'Mouvements' },
    // { id: 'categories', label: 'Catégories' },
    // { id: 'trends', label: 'Tendances' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* En-tête avec onglets */}
      <div className="border-b border-gray-200">
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Statistiques de Stock
          </h2>
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique en barres - Stock actuel */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Stock Actuel par Article</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graphique en secteurs - Statut du stock */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Statut du Stock</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'movements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique combiné - Entrées vs Sorties */}
            <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Entrées vs Sorties par Article</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entrees" fill="#10b981" name="Entrées" />
                    <Bar dataKey="sorties" fill="#ef4444" name="Sorties" />
                    <Line type="monotone" dataKey="stock" stroke="#3b82f6" name="Stock actuel" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique en secteurs - Stock par catégorie */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Stock par Catégorie</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graphique en barres - Articles par catégorie */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Nombre d'Articles par Catégorie</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Graphique en aires - Tendances des mouvements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Tendances des Mouvements (30 derniers jours)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="entrees" stackId="1" stroke="#10b981" fill="#10b981" name="Entrées" />
                    <Area type="monotone" dataKey="sorties" stackId="2" stroke="#ef4444" fill="#ef4444" name="Sorties" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graphique linéaire - Mouvement net */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Mouvement Net Quotidien</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Mouvement Net"
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {chartData.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            Aucune donnée à afficher
          </div>
        )}
      </div>
    </div>
  );
};

export default StatistiquesStock;