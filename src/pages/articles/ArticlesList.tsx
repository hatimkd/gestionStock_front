// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useGetArticlesQuery, useDeleteArticleMutation } from '../../redux/api/articlesApi';
// import { useAppSelector } from '../../redux/hooks';
// import { selectCurrentUser } from '../../redux/slices/authSlice';
// import { 
//   PackageOpen, 
//   Plus, 
//   Search, 
//   ChevronLeft, 
//   ChevronRight,
//   Trash2,
//   Pencil,
//   AlertTriangle,
//   Loader2,
//   FileDown,
//   Filter
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import ArticleForm from '../../components/articles/ArticleForm';

// const ArticlesList = () => {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
//   const [filterByCritical, setFilterByCritical] = useState(false);
  
//   const { data, error, isLoading, refetch } = useGetArticlesQuery({ 
//     page, 
//     limit 
//   });
  
//   const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
//   const currentUser = useAppSelector(selectCurrentUser);
//   const isManager = currentUser?.roles === 'gestionnaire';

//   useEffect(() => {
//     if (data?.results) {
//       let filtered = [...data.results];
      
//       // Apply search filter
//       if (searchTerm) {
//         filtered = filtered.filter(article => 
//           article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           article.reference.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
      
//       // Apply critical filter
//       if (filterByCritical) {
//         filtered = filtered.filter(article => article.is_critical);
//       }
      
//       setFilteredArticles(filtered);
//     }
//   }, [data, searchTerm, filterByCritical]);

//   const handleDelete = async (id: number) => {
//     if (confirm('Are you sure you want to delete this article?')) {
//       try {
//         await deleteArticle(id).unwrap();
//         toast.success('Article deleted successfully');
//       } catch (error) {
//         toast.error('Failed to delete article');
//       }
//     }
//   };

//   const handleExport = () => {
//     if (!data?.results) return;
    
//     const csvData = [
//       ['Name', 'Reference', 'Quantity', 'Unit Price', 'Critical Threshold', 'Status'],
//       ...data.results.map(article => [
//         article.name,
//         article.reference,
//         article.quantity.toString(),
//         article.unit_price,
//         article.critical_threshold.toString(),
//         article.is_critical ? 'Critical' : 'Normal'
//       ])
//     ];
    
//     const csvContent = csvData.map(row => row.join(',')).join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'articles_export.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage > 0 && (!data || newPage <= Math.ceil((data.count || 0) / limit))) {
//       setPage(newPage);
//     }
//   };

//   if (error) {
//     return <div className="text-center py-10 text-red-500">Error loading articles</div>;
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-semibold text-gray-900">Inventory Items</h1>
        
//         <div className="flex space-x-2">
// {(isManager || currentUser?.roles === "admin") && (
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//             >
//               <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//               Add Item
//             </button>
//           )}
          
//           <button
//             onClick={handleExport}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//           >
//             <FileDown className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//             Export
//           </button>
//         </div>
//       </div>
      
//       {/* Filters and Search */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-6">
//         <div className="w-full sm:w-1/2 lg:w-1/3">
//           <div className="relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
//               placeholder="Search by name or reference..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setFilterByCritical(!filterByCritical)}
//             className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm leading-5 font-medium ${
//               filterByCritical 
//                 ? 'bg-red-100 text-red-800 border-red-200' 
//                 : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <Filter className="h-4 w-4 mr-1" />
//             {filterByCritical ? 'Clear Filter' : 'Critical Only'}
//           </button>
          
//           <div className="border-l border-gray-300 h-6 mx-2"></div>
          
//           <div className="flex items-center">
//             <span className="text-sm text-gray-500 mr-2">Show:</span>
//             <select
//               value={limit}
//               onChange={(e) => setLimit(Number(e.target.value))}
//               className="block w-20 py-1.5 pl-3 pr-8 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
//             >
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={50}>50</option>
//             </select>
//           </div>
//         </div>
//       </div>
      
//       {/* Articles Table */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
//           </div>
//         ) : filteredArticles.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Article
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Reference
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Quantity
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Price
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
// {(isManager || currentUser?.roles === "admin") && (

//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredArticles.map((article) => (
//                   <tr key={article.id} className={`hover:bg-gray-50 ${article.is_critical ? 'bg-red-50' : ''}`}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
//                           {article.image ? (
//                             <img src={article.image} alt={article.name} className="h-full w-full object-cover" />
//                           ) : (
//                             <PackageOpen className="h-5 w-5 text-gray-500" />
//                           )}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             <Link to={`/dashboard/articles/${article.id}`} className="hover:text-primary-600">
//                               {article.name}
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{article.reference.slice(0, 8)}...</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{article.quantity}</div>
//                       <div className="text-xs text-gray-500">Threshold: {article.critical_threshold}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">${article.unit_price}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {article.is_critical ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                           Critical
//                         </span>
//                       ) : article.quantity > article.critical_threshold * 2 ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Good
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                           Low
//                         </span>
//                       )}
//                     </td>
// {(isManager || currentUser?.roles === "admin") && (                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex items-center justify-end space-x-2">
//                           <Link
//                             to={`/dashboard/articles/${article.id}`}
//                             className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-gray-100"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Link>
//                           <button
//                             onClick={() => handleDelete(article.id)}
//                             disabled={isDeleting}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-gray-100"
//                           >
//                             {isDeleting ? (
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                             ) : (
//                               <Trash2 className="h-4 w-4" />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-10">
//             <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               {searchTerm ? `No results for "${searchTerm}"` : 'Start by adding a new inventory item'}
//             </p>
//             {isManager && !searchTerm && (
//               <div className="mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(true)}
//                   className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                 >
//                   <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//                   Add New Item
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Pagination */}
//         {data && data.count > 0 && (
//           <nav
//             className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
//             aria-label="Pagination"
//           >
//             <div className="hidden sm:block">
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
//                 <span className="font-medium">
//                   {Math.min(page * limit, data.count)}
//                 </span>{' '}
//                 of <span className="font-medium">{data.count}</span> results
//               </p>
//             </div>
//             <div className="flex-1 flex justify-between sm:justify-end">
//               <button
//                 onClick={() => handlePageChange(page - 1)}
//                 disabled={page === 1}
//                 className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${
//                   page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
//                 }`}
//               >
//                 <ChevronLeft className="h-5 w-5 mr-2" />
//                 Previous
//               </button>
//               <button
//                 onClick={() => handlePageChange(page + 1)}
//                 disabled={page * limit >= data.count}
//                 className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${
//                   page * limit >= data.count ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
//                 }`}
//               >
//                 Next
//                 <ChevronRight className="h-5 w-5 ml-2" />
//               </button>
//             </div>
//           </nav>
//         )}
//       </div>
      
//       {/* Add Article Modal */}
//       {showAddModal && (
//         <ArticleForm 
//           onClose={() => setShowAddModal(false)} 
//           onSuccess={() => {
//             setShowAddModal(false);
//             refetch();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default ArticlesList;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetArticlesQuery, useDeleteArticleMutation, useUpdateArticleMutation } from '../../redux/api/articlesApi';
import { useAppSelector } from '../../redux/hooks';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import { 
  PackageOpen, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  Pencil,
  AlertTriangle,
  Loader2,
  FileDown,
  Filter,
  X,
  Save
} from 'lucide-react';
import { toast } from 'react-toastify';
import ArticleForm from '../../components/articles/ArticleForm';

interface Article {
  id: number;
  name: string;
  reference: string;
  quantity: number;
  unit_price: string;
  critical_threshold: number;
  is_critical: boolean;
  image?: string;
}

const ArticlesList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [filterByCritical, setFilterByCritical] = useState(false);
  
  // Form state for update modal
  const [updateForm, setUpdateForm] = useState({
    name: '',
    reference: '',
    quantity: 0,
    unit_price: '',
    critical_threshold: 0,
  });
  
  const { data, error, isLoading, refetch } = useGetArticlesQuery({ 
    page, 
    limit 
  });
  
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const currentUser = useAppSelector(selectCurrentUser);
  const isManager = currentUser?.roles === 'gestionnaire';

  useEffect(() => {
    if (data?.results) {
      let filtered = [...data.results];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(article => 
          article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.reference.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply critical filter
      if (filterByCritical) {
        filtered = filtered.filter(article => article.is_critical);
      }
      
      setFilteredArticles(filtered);
    }
  }, [data, searchTerm, filterByCritical]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id).unwrap();
        toast.success('Article deleted successfully');
      } catch (error) {
        toast.error('Failed to delete article');
      }
    }
  };

  const handleUpdateClick = (article: Article) => {
    setSelectedArticle(article);
    setUpdateForm({
      name: article.name,
      reference: article.reference,
      quantity: article.quantity,
      unit_price: article.unit_price,
      critical_threshold: article.critical_threshold,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    try {
      await updateArticle({
        id: selectedArticle.id,
        ...updateForm,
      }).unwrap();
      toast.success('Article updated successfully');
      setShowUpdateModal(false);
      setSelectedArticle(null);
      refetch();
    } catch (error) {
      toast.error('Failed to update article');
    }
  };

  const handleUpdateFormChange = (field: string, value: string | number) => {
    setUpdateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedArticle(null);
    setUpdateForm({
      name: '',
      reference: '',
      quantity: 0,
      unit_price: '',
      critical_threshold: 0,
    });
  };

  const handleExport = () => {
    if (!data?.results) return;
    
    const csvData = [
      ['Name', 'Reference', 'Quantity', 'Unit Price', 'Critical Threshold', 'Status'],
      ...data.results.map(article => [
        article.name,
        article.reference,
        article.quantity.toString(),
        article.unit_price,
        article.critical_threshold.toString(),
        article.is_critical ? 'Critical' : 'Normal'
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'articles_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (!data || newPage <= Math.ceil((data.count || 0) / limit))) {
      setPage(newPage);
    }
  };

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading articles</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Items</h1>
        
        <div className="flex space-x-2">
          {(isManager || currentUser?.roles === "admin") && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Item
            </button>
          )}
          
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FileDown className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-6">
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search by name or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterByCritical(!filterByCritical)}
            className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm leading-5 font-medium ${
              filterByCritical 
                ? 'bg-red-100 text-red-800 border-red-200' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-1" />
            {filterByCritical ? 'Clear Filter' : 'Critical Only'}
          </button>
          
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Show:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="block w-20 py-1.5 pl-3 pr-8 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Articles Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {(isManager || currentUser?.roles === "admin") && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className={`hover:bg-gray-50 ${article.is_critical ? 'bg-red-50' : ''}`}>
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
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{article.reference.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{article.quantity}</div>
                      <div className="text-xs text-gray-500">Threshold: {article.critical_threshold}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${article.unit_price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {article.is_critical ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Critical
                        </span>
                      ) : article.quantity > article.critical_threshold * 2 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Good
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Low
                        </span>
                      )}
                    </td>
                    {(isManager || currentUser?.roles === "admin") && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleUpdateClick(article)}
                            className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-gray-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-gray-100"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? `No results for "${searchTerm}"` : 'Start by adding a new inventory item'}
            </p>
            {isManager && !searchTerm && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add New Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {data && data.count > 0 && (
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * limit, data.count)}
                </span>{' '}
                of <span className="font-medium">{data.count}</span> results
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${
                  page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page * limit >= data.count}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${
                  page * limit >= data.count ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </nav>
        )}
      </div>
      
      {/* Add Article Modal */}
      {showAddModal && (
        <ArticleForm 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false);
            refetch();
          }}
        />
      )}

      {/* Update Article Modal */}
      {showUpdateModal && selectedArticle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Update Article</h3>
              <button
                onClick={closeUpdateModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={updateForm.name}
                  onChange={(e) => handleUpdateFormChange('name', e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                  Reference
                </label>
                <input
                  type="text"
                  id="reference"
                  value={updateForm.reference}
                  onChange={(e) => handleUpdateFormChange('reference', e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={updateForm.quantity}
                  onChange={(e) => handleUpdateFormChange('quantity', parseInt(e.target.value) || 0)}
                  required
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700">
                  Unit Price ($)
                </label>
                <input
                  type="number"
                  id="unit_price"
                  step="0.01"
                  value={updateForm.unit_price}
                  onChange={(e) => handleUpdateFormChange('unit_price', e.target.value)}
                  required
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="critical_threshold" className="block text-sm font-medium text-gray-700">
                  Critical Threshold
                </label>
                <input
                  type="number"
                  id="critical_threshold"
                  value={updateForm.critical_threshold}
                  onChange={(e) => handleUpdateFormChange('critical_threshold', parseInt(e.target.value) || 0)}
                  required
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Article
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;