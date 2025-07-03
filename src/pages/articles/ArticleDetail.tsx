import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetArticleByIdQuery, useUpdateArticleMutation, useDeleteArticleMutation } from '../../redux/api/articlesApi';
import { useAppSelector } from '../../redux/hooks';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { 
  ChevronLeft, 
  Pencil, 
  Trash2, 
  AlertTriangle,
  Save,
  X,
  PackageOpen,
  Tag,
  DollarSign,
  Hash,
  AlertCircle,
  Clock,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { useGetCategoriesQuery } from '../../redux/api/categoriesApi';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useGetArticleByIdQuery(Number(id));
  // const { data: categories.results } = useGetCategoriesQuery();
    // const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
    const { data: categories } = useGetCategoriesQuery();
useEffect(()=>{
  console.log(categories);
  
})

  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  
  const currentUser = useAppSelector(selectCurrentUser);
  const isManager = currentUser?.roles === 'gestionnaire';
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unit_price: '',
    quantity: 0,
    critical_threshold: 0,
    category: null as number | null,
    image: ''
  });
  
  useEffect(() => {
    if (article) {
      setFormData({
        name: article.name,
        unit_price: article.unit_price,
        quantity: article.quantity,
        critical_threshold: article.critical_threshold,
        category: article.category,
        image: article.image
      });
    }
  }, [article]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateArticle({
        id: Number(id),
        ...formData
      }).unwrap();
      
      toast.success('Article updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update article');
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await deleteArticle(Number(id)).unwrap();
      toast.success('Article deleted successfully');
      navigate('/dashboard/articles');
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Article not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The article you are looking for does not exist or has been removed.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/articles')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <ChevronLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }
  
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId || !categories) return 'None';
    const category = categories.results.find(c => c.id === categoryId);
    return category ? category.name : 'None';
  };

  return (
    <div>
      {/* Back button */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate('/dashboard/articles')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ChevronLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Back to Articles
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Article Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {isEditing ? 'Edit article information' : 'View article information and inventory status'}
            </p>
          </div>
          
          {isManager && !isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Pencil className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isDeleting ? (
                  <Loader2 className="-ml-0.5 mr-2 h-4 w-4 animate-spin\" aria-hidden="true" />
                ) : (
                  <Trash2 className="-ml-0.5 mr-2 h-4 w-4\" aria-hidden="true" />
                )}
                Delete
              </button>
            </div>
          )}
          
          {isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isUpdating ? (
                  <Loader2 className="-ml-0.5 mr-2 h-4 w-4 animate-spin\" aria-hidden="true" />
                ) : (
                  <Save className="-ml-0.5 mr-2 h-4 w-4\" aria-hidden="true" />
                )}
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <X className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Cancel
              </button>
            </div>
          )}
        </div>
        
        {article.is_critical && !isEditing && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mb-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  This item is below the critical threshold! Current quantity: <strong>{article.quantity}</strong>, Threshold: <strong>{article.critical_threshold}</strong>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isEditing ? (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <div className="mt-1">
                    <select
                      id="category"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">-- None --</option>
                      {categories?.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700">
                    Unit Price
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="unit_price"
                      id="unit_price"
                      value={formData.unit_price}
                      onChange={handleChange}
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="critical_threshold" className="block text-sm font-medium text-gray-700">
                    Critical Threshold
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="critical_threshold"
                      id="critical_threshold"
                      min="0"
                      value={formData.critical_threshold}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="image"
                      id="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter the URL of the image for this article.
                  </p>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-5 sm:p-6">
                <div>
                  <div className="flex items-center mb-6">
                    <PackageOpen className="h-6 w-6 text-primary-500 mr-3" />
                    <h4 className="text-lg font-medium text-gray-900">Details</h4>
                  </div>
                  
                  <dl className="space-y-4">
                    <div className="flex items-start">
                      <dt className="flex items-center text-sm font-medium text-gray-500 mr-3">
                        <Tag className="h-4 w-4 mr-1" />
                        Name:
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">{article.name}</dd>
                    </div>
                    
                    <div className="flex items-start">
                      <dt className="flex items-center text-sm font-medium text-gray-500 mr-3">
                        <Hash className="h-4 w-4 mr-1" />
                        Reference:
                      </dt>
                      <dd className="text-sm text-gray-900">{article.reference}</dd>
                    </div>
                    
                    <div className="flex items-start">
                      <dt className="flex items-center text-sm font-medium text-gray-500 mr-3">
                        <Tag className="h-4 w-4 mr-1" />
                        Category:
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {article.category.name }
                      </dd>
                    </div>
                    
                    <div className="flex items-start">
                      <dt className="flex items-center text-sm font-medium text-gray-500 mr-3">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Unit Price:
                      </dt>
                      <dd className="text-sm text-gray-900">${article.unit_price}</dd>
                    </div>
                    
                    <div className="flex items-start">
                      <dt className="flex items-center text-sm font-medium text-gray-500 mr-3">
                        <Clock className="h-4 w-4 mr-1" />
                        Created:
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(article.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <div className="flex items-center mb-6">
                    <ImageIcon className="h-6 w-6 text-primary-500 mr-3" />
                    <h4 className="text-lg font-medium text-gray-900">Image</h4>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 h-56 flex items-center justify-center">
                    {article.image ? (
                      <img 
                        src={article.image} 
                        alt={article.name} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <PackageOpen className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">No image available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="flex items-center mb-6">
                <AlertCircle className="h-6 w-6 text-primary-500 mr-3" />
                <h4 className="text-lg font-medium text-gray-900">Stock Information</h4>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500">Current Quantity</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      {article.quantity}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500">Critical Threshold</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      {article.critical_threshold}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="mt-1">
                      {article.is_critical ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Critical
                        </span>
                      ) : article.quantity > article.critical_threshold * 2 ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Good
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Low
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Stock level visualization */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Stock Level</span>
                    <span className="text-gray-900 font-medium">
                      {article.quantity > 0 
                        ? `${Math.min(Math.round((article.quantity / (article.critical_threshold * 3)) * 100), 100)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        article.is_critical ? 'bg-red-600' : 
                        article.quantity > article.critical_threshold * 2 ? 'bg-green-500' : 'bg-yellow-500'
                      }`} 
                      style={{ 
                        width: article.quantity > 0 
                          ? `${Math.min(Math.round((article.quantity / (article.critical_threshold * 3)) * 100), 100)}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;