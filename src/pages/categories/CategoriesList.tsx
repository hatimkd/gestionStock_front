// import { useState } from 'react';
// import { 
//   useGetCategoriesQuery, 
//   useAddCategoryMutation, 
//   useUpdateCategoryMutation, 
//   useDeleteCategoryMutation 
// } from '../../redux/api/categoriesApi';
// import { Tag, Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useAppSelector } from '../../redux/hooks';
// import { selectCurrentUser } from '../../redux/slices/authSlice';

// const CategoriesList = () => {
//   const { data: categories, isLoading, refetch } = useGetCategoriesQuery();
//   const [addCategory] = useAddCategoryMutation();
//   const [updateCategory] = useUpdateCategoryMutation();
//   const [deleteCategory] = useDeleteCategoryMutation();
  
//   const currentUser = useAppSelector(selectCurrentUser);
//   const isManager = currentUser?.roles === 'gestionnaire';
  
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: ''
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       await addCategory(formData).unwrap();
//       toast.success('Category added successfully');
//       setFormData({ name: '', description: '' });
//       setIsAdding(false);
//       refetch();
//     } catch (error) {
//       toast.error('Failed to add category');
//     }
//   };

//   const handleUpdate = async (e: React.FormEvent, id: number) => {
//     e.preventDefault();
    
//     try {
//       await updateCategory({ id, ...formData }).unwrap();
//       toast.success('Category updated successfully');
//       setEditingId(null);
//       refetch();
//     } catch (error) {
//       toast.error('Failed to update category');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this category?')) return;
    
//     try {
//       await deleteCategory(id).unwrap();
//       toast.success('Category deleted successfully');
//       refetch();
//     } catch (error) {
//       toast.error('Failed to delete category');
//     }
//   };

//   const startEdit = (category: any) => {
//     setFormData({
//       name: category.name,
//       description: category.description
//     });
//     setEditingId(category.id);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        
//         {isManager && !isAdding && (
//           <button
//             type="button"
//             onClick={() => setIsAdding(true)}
//             className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//           >
//             <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//             Add Category
//           </button>
//         )}
//       </div>
      
//       {isAdding && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-medium text-gray-900">Add New Category</h2>
//             <button
//               type="button"
//               onClick={() => setIsAdding(false)}
//               className="text-gray-400 hover:text-gray-500"
//             >
//               <X className="h-5 w-5" aria-hidden="true" />
//             </button>
//           </div>
          
//           <form onSubmit={handleAdd}>
//             <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//               <div className="sm:col-span-3">
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Name
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     type="text"
//                     name="name"
//                     id="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="sm:col-span-6">
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                   Description
//                 </label>
//                 <div className="mt-1">
//                   <textarea
//                     name="description"
//                     id="description"
//                     rows={3}
//                     value={formData.description}
//                     onChange={handleChange}
//                     className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   />
//                 </div>
//               </div>
//             </div>
            
//             <div className="mt-6 flex justify-end">
//               <button
//                 type="button"
//                 onClick={() => setIsAdding(false)}
//                 className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//               >
//                 <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//                 Save
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
      
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         {categories && categories.length > 0 ? (
//           <ul className="divide-y divide-gray-200">
//             {categories.map((category) => (
//               <li key={category.id}>
//                 {editingId === category.id ? (
//                   <div className="p-6 animate-fade-in">
//                     <form onSubmit={(e) => handleUpdate(e, category.id)}>
//                       <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//                         <div className="sm:col-span-3">
//                           <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
//                             Name
//                           </label>
//                           <div className="mt-1">
//                             <input
//                               type="text"
//                               name="name"
//                               id="edit-name"
//                               value={formData.name}
//                               onChange={handleChange}
//                               className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                               required
//                             />
//                           </div>
//                         </div>
                        
//                         <div className="sm:col-span-6">
//                           <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
//                             Description
//                           </label>
//                           <div className="mt-1">
//                             <textarea
//                               name="description"
//                               id="edit-description"
//                               rows={3}
//                               value={formData.description}
//                               onChange={handleChange}
//                               className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                             />
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="mt-6 flex justify-end">
//                         <button
//                           type="button"
//                           onClick={() => setEditingId(null)}
//                           className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                         >
//                           <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//                           Save
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 ) : (
//                   <div className="px-6 py-5 flex items-center justify-between hover:bg-gray-50">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 rounded bg-primary-100 flex items-center justify-center">
//                         <Tag className="h-5 w-5 text-primary-600" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{category.name}</div>
//                         <div className="text-sm text-gray-500">{category.description}</div>
//                       </div>
//                     </div>
                    
//                     {isManager && (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => startEdit(category)}
//                           className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-gray-100"
//                         >
//                           <Pencil className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(category.id)}
//                           className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-gray-100"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="text-center py-12">
//             <Tag className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               Get started by creating a new category.
//             </p>
//             {isManager && !isAdding && (
//               <div className="mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setIsAdding(true)}
//                   className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                 >
//                   <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//                   Add New Category
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CategoriesList;


import { useEffect, useState } from 'react';
import { 
  useGetCategoriesQuery, 
  useAddCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation,
  type Category 
} from '../../redux/api/categoriesApi';
import { Tag, Plus, Pencil, Trash2, X, Save, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../redux/hooks';
import { selectCurrentUser } from '../../redux/slices/authSlice';

const CategoriesList = () => {
  // const { data: categories.results, isLoading, error, refetch } = useGetCategoriesQuery();




  const { data, isLoading, error, refetch } = useGetCategoriesQuery();

  
const categories = data?.results || [];
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  
  const currentUser = useAppSelector(selectCurrentUser);
  const isManager = currentUser?.roles === 'gestionnaire';
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({ name: '', description: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      await addCategory({
        name: formData.name.trim(),
        description: formData.description.trim()
      }).unwrap();
      
      toast.success('Category added successfully');
      resetForm();
      setShowAddForm(false);
    } catch (error: any) {
      console.error('Failed to add category:', error);
      toast.error(error?.data?.message || 'Failed to add category');
    }
  };

  useEffect(()=>{
    console.log(categories);
    
  })
  const handleUpdate = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      await updateCategory({ 
        id, 
        name: formData.name.trim(),
        description: formData.description.trim()
      }).unwrap();
      
      toast.success('Category updated successfully');
      setEditingId(null);
      resetForm();
    } catch (error: any) {
      console.error('Failed to update category:', error);
      toast.error(error?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id: number, categoryName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) return;
    
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      toast.error(error?.data?.message || 'Failed to delete category');
    }
  };

  const startEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description
    });
    setEditingId(category.id);
    setShowAddForm(false); // Close add form if open
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading categories
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to fetch categories from the server.</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        
        {/* {isManager  */}
{(isManager || currentUser?.roles === "admin") 

        && !showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Category
          </button>
        )}
      </div>
      
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Add New Category</h2>
            <button
              type="button"
              onClick={cancelAdd}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
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
                    maxLength={100}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={cancelAdd}
                disabled={isAdding}
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding || !formData.name.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <Loader2 className="-ml-1 mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                )}
                {isAdding ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {categories && categories.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category.id}>
                {editingId === category.id ? (
                  <div className="p-6 animate-fade-in">
                    <form onSubmit={(e) => handleUpdate(e, category.id)}>
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                            Name *
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="edit-name"
                              value={formData.name}
                              onChange={handleChange}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              required
                              maxLength={100}
                            />
                          </div>
                        </div>
                        
                        <div className="sm:col-span-6">
                          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <div className="mt-1">
                            <textarea
                              name="description"
                              id="edit-description"
                              rows={3}
                              value={formData.description}
                              onChange={handleChange}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              maxLength={500}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={isUpdating}
                          className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdating || !formData.name.trim()}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? (
                            <Loader2 className="-ml-1 mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          )}
                          {isUpdating ? 'Updating...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="px-6 py-5 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded bg-primary-100 flex items-center justify-center">
                        <Tag className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description || 'No description'}</div>
                      </div>
                    </div>
                    
                    {(isManager || currentUser?.roles === "admin") && (

                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(category)}
                          disabled={editingId !== null || isDeleting}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit category"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          disabled={editingId !== null || isDeleting}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete category"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new category.
            </p>
            {isManager && !showAddForm && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add New Category
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;