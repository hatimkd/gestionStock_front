// import { useState } from 'react';
// import { X, Save, Loader2 } from 'lucide-react';
// import { useAddArticleMutation } from '../../redux/api/articlesApi';
// import { useGetCategoriesQuery } from '../../redux/api/categoriesApi';
// import { toast } from 'react-toastify';

// interface ArticleFormProps {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const ArticleForm = ({ onClose, onSuccess }: ArticleFormProps) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     unit_price: '',
//     quantity: 0,
//     critical_threshold: 0,
//     category: null as number | null,
//     image: ''
//   });
  
//   const [addArticle, { isLoading }] = useAddArticleMutation();
//   const { data: categories } = useGetCategoriesQuery();
  
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target as HTMLInputElement;
    
//     setFormData({
//       ...formData,
//       [name]: type === 'number' ? parseInt(value) || 0 : value
//     });
//   };
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       await addArticle(formData).unwrap();
//       toast.success('Article added successfully');
//       onSuccess();
//     } catch (error) {
//       toast.error('Failed to add article');
//     }
//   };
  
//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
//       <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 animate-fade-in">
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-lg font-medium text-gray-900">Add New Article</h2>
//           <button
//             type="button"
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-500 focus:outline-none"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-4 sm:p-6">
//           <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//             <div className="sm:col-span-6">
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Name *
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="text"
//                   name="name"
//                   id="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//             </div>
            
//             <div className="sm:col-span-3">
//               <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//                 Category
//               </label>
//               <div className="mt-1">
//                 <select
//                   id="category"
//                   name="category"
//                   value={formData.category || ''}
//                   onChange={handleChange}
//                   className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                 >
//                   <option value="">-- None --</option>
//                   {categories?.map(category => (
//                     <option key={category.id} value={category.id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div className="sm:col-span-3">
//               <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700">
//                 Unit Price *
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-500 sm:text-sm">$</span>
//                 </div>
//                 <input
//                   type="text"
//                   name="unit_price"
//                   id="unit_price"
//                   value={formData.unit_price}
//                   onChange={handleChange}
//                   className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
//                   placeholder="0.00"
//                   required
//                 />
//               </div>
//             </div>
            
//             <div className="sm:col-span-3">
//               <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
//                 Quantity *
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="quantity"
//                   id="quantity"
//                   min="0"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                   className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//             </div>
            
//             <div className="sm:col-span-3">
//               <label htmlFor="critical_threshold" className="block text-sm font-medium text-gray-700">
//                 Critical Threshold *
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="critical_threshold"
//                   id="critical_threshold"
//                   min="0"
//                   value={formData.critical_threshold}
//                   onChange={handleChange}
//                   className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   required
//                 />
//                 <p className="mt-1 text-xs text-gray-500">
//                   The minimum quantity before the item is flagged as critical.
//                 </p>
//               </div>
//             </div>
            
//             <div className="sm:col-span-6">
//               <label htmlFor="image" className="block text-sm font-medium text-gray-700">
//                 Image URL
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="text"
//                   name="image"
//                   id="image"
//                   value={formData.image}
//                   onChange={handleChange}
//                   className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   placeholder="https://example.com/image.jpg"
//                 />
//               </div>
//               <p className="mt-2 text-sm text-gray-500">
//                 Enter the URL of the image for this article.
//               </p>
//             </div>
//           </div>
          
//           <div className="mt-6 flex justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="-ml-1 mr-2 h-5 w-5 animate-spin\" aria-hidden="true" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//                   Save
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ArticleForm;


import { useState, useEffect } from 'react';
import { X, Package, FileText, DollarSign, Hash, AlertTriangle, Upload, Tag } from 'lucide-react';
import { useGetCategoriesQuery } from '../../redux/api/categoriesApi';
import { useAddArticleMutation } from '../../redux/api/articlesApi';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ArticleFormProps {
  onClose: () => void;
  onSuccess: () => void;
  article?: any; // For editing existing articles
}

const ArticleForm = ({ onClose, onSuccess, article }: ArticleFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    category_id: '',
    unit_price: '',
    quantity: '',
    critical_threshold: '',
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories from API - same pattern as ManagerDashboard
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
  
  // Add article mutation
  const [addArticle, { isLoading: isAddingArticle }] = useAddArticleMutation();

  // Initialize form with existing article data if editing
  useEffect(() => {
    if (article) {
      setFormData({
        name: article.name || '',
        reference: article.reference || '',
        category_id: article.category?.id?.toString() || '',
        unit_price: article.unit_price || '',
        quantity: article.quantity?.toString() || '',
        critical_threshold: article.critical_threshold?.toString() || '',
        image: null,
      });
      if (article.image) {
        setImagePreview(article.image);
      }
    }
  }, [article]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateReference = () => {
    // Generate a UUID-like reference
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setFormData(prev => ({
      ...prev,
      reference: uuid
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Prepare article data
      const articleData = {
        name: formData.name,
        reference: formData.reference,
        category_id: parseInt(formData.category_id),
        unit_price: parseFloat(formData.unit_price),
        quantity: parseInt(formData.quantity),
        critical_threshold: parseInt(formData.critical_threshold),
      };

      // If there's an image, create FormData for file upload
      if (formData.image) {
        const submitData = new FormData();
        Object.keys(articleData).forEach(key => {
          submitData.append(key, articleData[key].toString());
        });
        submitData.append('image', formData.image);
        
        // Call the mutation with FormData
        await addArticle(submitData).unwrap();
      } else {
        // Call the mutation with regular object
        await addArticle(articleData).unwrap();
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to save article. Please try again.');
      console.error('Error saving article:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {article ? 'Edit Article' : 'Add New Article'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {categoriesError && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
              Failed to load categories. Please refresh the page.
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline h-4 w-4 mr-1" />
              Article Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Article Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="inline h-4 w-4 mr-1" />
              Article Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter article name"
              required
            />
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="inline h-4 w-4 mr-1" />
              Reference *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Article reference"
                required
              />
              <button
                type="button"
                onClick={generateReference}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline h-4 w-4 mr-1" />
              Category *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select a category'}
              </option>
              {Array.isArray(categories.results) && categories.results.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Unit Price *
              </label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline h-4 w-4 mr-1" />
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Critical Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="inline h-4 w-4 mr-1" />
              Critical Threshold *
            </label>
            <input
              type="number"
              name="critical_threshold"
              value={formData.critical_threshold}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Minimum stock level"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Alert when quantity falls below this threshold
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isAddingArticle}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isLoading || isAddingArticle) ? 'Saving...' : (article ? 'Update Article' : 'Create Article')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;