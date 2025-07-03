// // import { useState, useEffect } from 'react';
// // import { Search, Filter, Plus, Loader2, FileDown, ArrowDown, ArrowUp, X } from 'lucide-react';
// // import { useGetStockMovementsQuery, useAddStockMovementMutation } from '../../redux/api/stockMovementsApi';

// // const StockMovements = () => {
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
// //   const [page, setPage] = useState(1);
// //   const [limit, setLimit] = useState(10);
// //   const [showModal, setShowModal] = useState(false);
// //   const [formData, setFormData] = useState({
// //     article: '',
// //     movement_type: 'in' as 'in' | 'out',
// //     quantity: '',
// //     reference_document: '',
// //     comment: ''
// //   });

// //   const { data, isLoading } = useGetStockMovementsQuery({ page, limit });
// //   const [addStockMovement, { isLoading: isAdding }] = useAddStockMovementMutation();

// //   const filteredData = (data?.results || []).filter((movement: any) => {
// //     const name = movement?.article_name?.toLowerCase() || '';
// //     const match = name.includes(searchTerm.toLowerCase());
// //     const typeMatch = filterType === 'all' || movement.movement_type === filterType;
// //     return match && typeMatch;
// //   });

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       await addStockMovement({
// //         article: parseInt(formData.article),
// //         movement_type: formData.movement_type,
// //         quantity: parseInt(formData.quantity),
// //         reference_document: formData.reference_document,
// //         comment: formData.comment
// //       }).unwrap();
      
// //       // Reset form and close modal
// //       setFormData({
// //         article: '',
// //         movement_type: 'in',
// //         quantity: '',
// //         reference_document: '',
// //         comment: ''
// //       });
// //       setShowModal(false);
// //     } catch (error) {
// //       console.error('Error adding movement:', error);
// //     }
// //   };

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   return (
// //     <div className="p-6 bg-white rounded shadow">
// //       <div className="flex justify-between items-center mb-6">
// //         <h2 className="text-2xl font-bold">Mouvements de stock</h2>
// //         <button 
// //           onClick={() => setShowModal(true)}
// //           className="flex items-center bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
// //         >
// //           <Plus className="mr-2 w-4 h-4" /> Ajouter Mouvement
// //         </button>
// //       </div>

// //       <div className="flex flex-wrap gap-4 mb-4">
// //         <div className="relative w-full sm:w-1/3">
// //           <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
// //           <input
// //             type="text"
// //             placeholder="Rechercher un article..."
// //             className="pl-10 pr-4 py-2 w-full border rounded-md"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //           />
// //         </div>

// //         <select
// //           value={filterType}
// //           onChange={(e) => setFilterType(e.target.value as any)}
// //           className="border rounded-md px-3 py-2"
// //         >
// //           <option value="all">Tous les mouvements</option>
// //           <option value="in">Entrées</option>
// //           <option value="out">Sorties</option>
// //         </select>

// //         <button className="flex items-center px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-100">
// //           <FileDown className="mr-2 w-4 h-4" />
// //           Exporter CSV
// //         </button>
// //       </div>

// //       <div className="overflow-auto rounded-md border">
// //         {isLoading ? (
// //           <div className="flex justify-center items-center h-40">
// //             <Loader2 className="animate-spin text-primary-600 w-8 h-8" />
// //           </div>
// //         ) : (
// //           <table className="min-w-full divide-y divide-gray-200 text-sm">
// //             <thead className="bg-gray-50 text-gray-700">
// //               <tr>
// //                 <th className="px-4 py-2 text-left">Article</th>
// //                 <th className="px-4 py-2 text-left">Quantité</th>
// //                 <th className="px-4 py-2 text-left">Type</th>
// //                 <th className="px-4 py-2 text-left">Date</th>
// //                 <th className="px-4 py-2 text-left">Référence</th>
// //                 <th className="px-4 py-2 text-left">Utilisateur</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-100">
// //               {filteredData?.map((m: any) => (
// //                 <tr key={m.id} className="hover:bg-gray-50">
// //                   <td className="px-4 py-2">{m.article_name}</td>
// //                   <td className="px-4 py-2">{m.quantity}</td>
// //                   <td className="px-4 py-2">
// //                     <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
// //                       m.movement_type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
// //                     }`}>
// //                       {m.movement_type === 'in' ? <ArrowDown className="w-3 h-3 mr-1" /> : <ArrowUp className="w-3 h-3 mr-1" />}
// //                       {m.movement_type === 'in' ? 'Entrée' : 'Sortie'}
// //                     </span>
// //                   </td>
// //                   <td className="px-4 py-2">{new Date(m.created_at).toLocaleDateString()}</td>
// //                   <td className="px-4 py-2">{m.reference_document || '—'}</td>
// //                   <td className="px-4 py-2">{m.user_name || '—'}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         )}
// //       </div>

// //       {/* Pagination */}
// //       {data && data.count > 0 && (
// //         <div className="flex items-center justify-between mt-6">
// //           <div className="text-sm text-gray-700">
// //             Affichage de {((page - 1) * limit) + 1} à {Math.min(page * limit, data.count)} sur {data.count} résultats
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <button
// //               onClick={() => setPage(page - 1)}
// //               disabled={!data.previous}
// //               className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// //             >
// //               Précédent
// //             </button>
// //             <span className="px-3 py-1 text-sm font-medium">
// //               Page {page}
// //             </span>
// //             <button
// //               onClick={() => setPage(page + 1)}
// //               disabled={!data.next}
// //               className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// //             >
// //               Suivant
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Modal for adding movement */}
// //       {showModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-lg font-semibold">Ajouter un mouvement</h3>
// //               <button
// //                 onClick={() => setShowModal(false)}
// //                 className="text-gray-400 hover:text-gray-600"
// //               >
// //                 <X className="w-5 h-5" />
// //               </button>
// //             </div>

// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Article ID
// //                 </label>
// //                 <input
// //                   type="number"
// //                   name="article"
// //                   value={formData.article}
// //                   onChange={handleInputChange}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Type de mouvement
// //                 </label>
// //                 <select
// //                   name="movement_type"
// //                   value={formData.movement_type}
// //                   onChange={handleInputChange}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
// //                 >
// //                   <option value="in">Entrée</option>
// //                   <option value="out">Sortie</option>
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Quantité
// //                 </label>
// //                 <input
// //                   type="number"
// //                   name="quantity"
// //                   value={formData.quantity}
// //                   onChange={handleInputChange}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
// //                   required
// //                   min="1"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Document de référence
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="reference_document"
// //                   value={formData.reference_document}
// //                   onChange={handleInputChange}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
// //                   placeholder="Ex: BON-ENTREE-2025-01"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Commentaire
// //                 </label>
// //                 <textarea
// //                   name="comment"
// //                   value={formData.comment}
// //                   onChange={handleInputChange}
// //                   rows={3}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
// //                   placeholder="Commentaire optionnel..."
// //                 />
// //               </div>

// //               <div className="flex gap-3 pt-4">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowModal(false)}
// //                   className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
// //                 >
// //                   Annuler
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={isAdding}
// //                   className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
// //                 >
// //                   {isAdding ? (
// //                     <Loader2 className="w-4 h-4 animate-spin" />
// //                   ) : (
// //                     'Ajouter'
// //                   )}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default StockMovements;
// import { useState, useEffect } from 'react';
// import { Search, Filter, Plus, Loader2, FileDown, ArrowDown, ArrowUp, X } from 'lucide-react';
// import { useGetStockMovementsQuery, useAddStockMovementMutation } from '../../redux/api/stockMovementsApi';
// import { useGetArticlesQuery } from '../../redux/api/articlesApi';
// // import { useGetArticlesQuery } from '../../redux/api/articlesApi';

// const StockMovements = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     article: '',
//     movement_type: 'in' as 'in' | 'out',
//     quantity: '',
//     reference_document: '',
//     comment: ''
//   });

//   const { data, isLoading } = useGetStockMovementsQuery({ page, limit });
//   const { data: articlesData } = useGetArticlesQuery();
//   const [addStockMovement, { isLoading: isAdding }] = useAddStockMovementMutation();

//   const filteredData = (data?.results || []).filter((movement: any) => {
//     const name = movement?.article_name?.toLowerCase() || '';
//     const match = name.includes(searchTerm.toLowerCase());
//     const typeMatch = filterType === 'all' || movement.movement_type === filterType;
//     return match && typeMatch;
//   });

//   useEffect(()=> {
//     useGetArticlesQuery()
//     console.log(articlesData);
    
  
// },[articlesData])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await addStockMovement({
//         article: parseInt(formData.article),
//         movement_type: formData.movement_type,
//         quantity: parseInt(formData.quantity),
//         reference_document: formData.reference_document,
//         comment: formData.comment
//       }).unwrap();
      
//       // Reset form and close modal
//       setFormData({
//         article: '',
//         movement_type: 'in',
//         quantity: '',
//         reference_document: '',
//         comment: ''
//       });
//       setShowModal(false);
//     } catch (error) {
//       console.error('Error adding movement:', error);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="p-6 bg-white rounded shadow">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Mouvements de stock</h2>
//         <button 
//           onClick={() => setShowModal(true)}
//           className="flex items-center bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
//         >
//           <Plus className="mr-2 w-4 h-4" /> Ajouter Mouvement
//         </button>
//       </div>

//       <div className="flex flex-wrap gap-4 mb-4">
//         <div className="relative w-full sm:w-1/3">
//           <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Rechercher un article..."
//             className="pl-10 pr-4 py-2 w-full border rounded-md"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value as any)}
//           className="border rounded-md px-3 py-2"
//         >
//           <option value="all">Tous les mouvements</option>
//           <option value="in">Entrées</option>
//           <option value="out">Sorties</option>
//         </select>

//         <button className="flex items-center px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-100">
//           <FileDown className="mr-2 w-4 h-4" />
//           Exporter CSV
//         </button>
//       </div>

//       <div className="overflow-auto rounded-md border">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-40">
//             <Loader2 className="animate-spin text-primary-600 w-8 h-8" />
//           </div>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200 text-sm">
//             <thead className="bg-gray-50 text-gray-700">
//               <tr>
//                 <th className="px-4 py-2 text-left">Article</th>
//                 <th className="px-4 py-2 text-left">Quantité</th>
//                 <th className="px-4 py-2 text-left">Type</th>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Référence</th>
//                 <th className="px-4 py-2 text-left">Utilisateur</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredData?.map((m: any) => (
//                 <tr key={m.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-2">{m.article_name}</td>
//                   <td className="px-4 py-2">{m.quantity}</td>
//                   <td className="px-4 py-2">
//                     <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
//                       m.movement_type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                       {m.movement_type === 'in' ? <ArrowDown className="w-3 h-3 mr-1" /> : <ArrowUp className="w-3 h-3 mr-1" />}
//                       {m.movement_type === 'in' ? 'Entrée' : 'Sortie'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2">{new Date(m.created_at).toLocaleDateString()}</td>
//                   <td className="px-4 py-2">{m.reference_document || '—'}</td>
//                   <td className="px-4 py-2">{m.user_name || '—'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pagination */}
//       {data && data.count > 0 && (
//         <div className="flex items-center justify-between mt-6">
//           <div className="text-sm text-gray-700">
//             Affichage de {((page - 1) * limit) + 1} à {Math.min(page * limit, data.count)} sur {data.count} résultats
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage(page - 1)}
//               disabled={!data.previous}
//               className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               Précédent
//             </button>
//             <span className="px-3 py-1 text-sm font-medium">
//               Page {page}
//             </span>
//             <button
//               onClick={() => setPage(page + 1)}
//               disabled={!data.next}
//               className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               Suivant
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Modal for adding movement */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Ajouter un mouvement</h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Article
//                 </label>
//                 <select
//                   name="article"
//                   value={formData.article}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 >
//                   <option value="">Sélectionner un article</option>
//                   {articlesData?.map((article: any) => (
//                     <option key={article.id} value={article.id}>
//                       {article.nom}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Type de mouvement
//                 </label>
//                 <select
//                   name="movement_type"
//                   value={formData.movement_type}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 >
//                   <option value="in">Entrée</option>
//                   <option value="out">Sortie</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Quantité
//                 </label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                   min="1"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Document de référence
//                 </label>
//                 <input
//                   type="text"
//                   name="reference_document"
//                   value={formData.reference_document}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="Ex: BON-ENTREE-2025-01"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Commentaire
//                 </label>
//                 <textarea
//                   name="comment"
//                   value={formData.comment}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="Commentaire optionnel..."
//                 />
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isAdding}
//                   className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
//                 >
//                   {isAdding ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     'Ajouter'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StockMovements;
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Loader2, FileDown, ArrowDown, ArrowUp, X } from 'lucide-react';
import { useGetStockMovementsQuery, useAddStockMovementMutation } from '../../redux/api/stockMovementsApi';
import { useGetArticleQuery } from '../../redux/api/articlesApi'; // Changed from useGetArticlesQuery to useGetArticleQuery
import { useGetCurrentUserQuery } from '../../redux/api/userApi';

const StockMovements = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: currentUser, isLoading: userLoading } = useGetCurrentUserQuery();

  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    article: '',
    movement_type: 'in' as 'in' | 'out',
    quantity: '',
    reference_document: '',
    comment: ''
  });

  const { data, isLoading } = useGetStockMovementsQuery({ page, limit });
  const { data: articlesData, isLoading: articlesLoading } = useGetArticleQuery(); // Fixed hook name
  const [addStockMovement, { isLoading: isAdding }] = useAddStockMovementMutation();

  const filteredData = (data?.results || []).filter((movement: any) => {
    const name = movement?.article_name?.toLowerCase() || '';
    const match = name.includes(searchTerm.toLowerCase());
    const typeMatch = filterType === 'all' || movement.movement_type === filterType;
    return match && typeMatch;
  });

  // Fixed useEffect
  useEffect(() => {
    if (articlesData) {
      console.log('Articles data:', articlesData);
    }
  }, [articlesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addStockMovement({
        article: parseInt(formData.article),
        movement_type: formData.movement_type,
        quantity: parseInt(formData.quantity),
        reference_document: formData.reference_document,
        comment: formData.comment
      }).unwrap();
      
      // Reset form and close modal
      setFormData({
        article: '',
        movement_type: 'in',
        quantity: '',
        reference_document: '',
        comment: ''
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error adding movement:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mouvements de stock</h2>
        {!userLoading && currentUser?.roles !== 'employee' && (
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          <Plus className="mr-2 w-4 h-4" /> Ajouter Mouvement
        </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            className="pl-10 pr-4 py-2 w-full border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="border rounded-md px-3 py-2"
        >
          <option value="all">Tous les mouvements</option>
          <option value="in">Entrées</option>
          <option value="out">Sorties</option>
        </select>

        <button className="flex items-center px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-100">
          <FileDown className="mr-2 w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      <div className="overflow-auto rounded-md border">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-primary-600 w-8 h-8" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Article</th>
                <th className="px-4 py-2 text-left">Quantité</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Référence</th>
                <th className="px-4 py-2 text-left">Utilisateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData?.map((m: any) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{m.article_name}</td>
                  <td className="px-4 py-2">{m.quantity}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      m.movement_type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {m.movement_type === 'in' ? <ArrowDown className="w-3 h-3 mr-1" /> : <ArrowUp className="w-3 h-3 mr-1" />}
                      {m.movement_type === 'in' ? 'Entrée' : 'Sortie'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{m.reference_document || '—'}</td>
                  <td className="px-4 py-2">{m.user_name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.count > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Affichage de {((page - 1) * limit) + 1} à {Math.min(page * limit, data.count)} sur {data.count} résultats
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!data.previous}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Précédent
            </button>
            <span className="px-3 py-1 text-sm font-medium">
              Page {page}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!data.next}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding movement */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Ajouter un mouvement</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Article
                </label>
                <select
                  name="article"
                  value={formData.article}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  disabled={articlesLoading}
                >
                  <option value="">
                    {articlesLoading ? 'Chargement...' : 'Sélectionner un article'}
                  </option>
                  {/* Handle both array and object responses */}
                  {Array.isArray(articlesData) 
                    ? articlesData.map((article: any) => (
                        <option key={article.id} value={article.id}>
                          {article.name}
                        </option>
                      ))
                    : articlesData?.results?.map((article: any) => (
                        <option key={article.id} value={article.id}>
                          {article.name}
                        </option>
                      ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de mouvement
                </label>
                <select
                  name="movement_type"
                  value={formData.movement_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="in">Entrée</option>
                  <option value="out">Sortie</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document de référence
                </label>
                <input
                  type="text"
                  name="reference_document"
                  value={formData.reference_document}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: BON-ENTREE-2025-01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Commentaire optionnel..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isAdding || articlesLoading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Ajouter'
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

export default StockMovements;