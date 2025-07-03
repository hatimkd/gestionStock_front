import { useState, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import {
  Plus, Search, ChevronLeft, ChevronRight, FileDown, Trash2, Pencil, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import {
  useAddArticleSupplierMutation,
  useDeleteArticleSupplierMutation,
  useGetArticleSuppliersQuery
} from '../../redux/api/articleSuppliersApi';
import { useGetArticleQuery, useGetArticlesQuery } from '../../redux/api/articlesApi';
import { useGetFournisseursQuery } from '../../redux/api/authApi';

const ArticleSupplierList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: articleSuppliersData, isLoading: articleSuppliersLoading, error, refetch } = useGetArticleSuppliersQuery({ page });
  const [deleteArticleSupplier] = useDeleteArticleSupplierMutation();
  const currentUser = useAppSelector(selectCurrentUser);
  const isManager = currentUser?.roles === 'gestionnaire';
  const [filtered, setFiltered] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Données articles et fournisseurs
  const { data: articlesData, isLoading: articlesLoading } = useGetArticleQuery();
const [addArticleSupplier] = useAddArticleSupplierMutation();

  const { data: fournisseursData, isLoading: fournisseursLoading } = useGetFournisseursQuery();

  // États formulaire modal
  const [articleId, setArticleId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [supplierReference, setSupplierReference] = useState('');
  const [supplierPrice, setSupplierPrice] = useState('');

  useEffect(() => {
    if (articleSuppliersData?.results) {
      const filteredData = articleSuppliersData.results.filter((as) =>
        (as.supplier_reference?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (as.supplier_id?.toString().includes(searchTerm)) ||
        (as.article_id?.toString().includes(searchTerm))
      );
      setFiltered(filteredData);
    }
  }, [articleSuppliersData, searchTerm]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteArticleSupplier(id).unwrap();
        toast.success('Deleted successfully');
        refetch();
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  const handleExport = () => {
    if (!articleSuppliersData?.results) return;
    const csv = [
      ['Article ID', 'Supplier ID', 'Supplier Reference', 'Supplier Price'],
      ...articleSuppliersData.results.map(as => [as.article_id, as.supplier_id, as.supplier_reference, as.supplier_price])
    ];
    const blob = new Blob([csv.map(row => row.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'article_suppliers.csv';
    a.click();
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    await addArticleSupplier({
      article_id: articleId,
      supplier_id: supplierId,
       supplier_reference: supplierReference,
      supplier_price: supplierPrice,
    }).unwrap(); // Déstructure proprement la promesse RTK Query

    toast.success('Fournisseur ajouté avec succès');
    setShowModal(false);
  } catch (error: any) {
    toast.error("Erreur lors de l'ajout du fournisseur");
    console.error("Erreur dans handleSubmit :", error);
  }
};
  const totalPages = articleSuppliersData ? Math.ceil(articleSuppliersData.count / limit) : 1;

  if (articleSuppliersLoading || articlesLoading || fournisseursLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading article suppliers</div>;

  return (
    <div>
      {/* Modal d'ajout */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Ajouter un Article Fournisseur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Article</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={articleId}
                  onChange={(e) => setArticleId(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un article</option>
                  {articlesData?.map((article: any) => (
                    <option key={article.id} value={article.id}>
                      {article.name || `Article #${article.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Fournisseur</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un fournisseur</option>
                  {fournisseursData?.map((fournisseur: any) => (
                    <option key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.username || `Fournisseur #${fournisseur.email}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Référence Fournisseur</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={supplierReference}
                  onChange={(e) => setSupplierReference(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Prix</label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2"
                  value={supplierPrice}
                  onChange={(e) => setSupplierPrice(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Article Suppliers</h1>
        <div className="flex gap-2">
          {(isManager || currentUser?.roles === "admin") && (

            <button onClick={() => setShowModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center">
              <Plus className="mr-2 w-4 h-4" /> Ajouter
            </button>
          )}
          <button onClick={handleExport} className="bg-white border px-4 py-2 rounded-md flex items-center">
            <FileDown className="mr-2 w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <div className="absolute left-3 top-2.5">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-3 py-2 border rounded-md w-full"
          placeholder="Search by article ID or supplier reference"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Article ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Supplier ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Supplier Reference</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Supplier Price</th>
              {(isManager || currentUser?.roles === "admin") && 
 <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((as) => (
              <tr key={as.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{as.article_id}</td>
                <td className="px-6 py-4 text-sm">{as.supplier_id}</td>
                <td className="px-6 py-4 text-sm">{as.supplier_reference}</td>
                <td className="px-6 py-4 text-sm">{as.supplier_price}</td>
{(isManager || currentUser?.roles === "admin") && (
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link to={`/dashboard/article-suppliers/${as.id}/edit`} className="text-blue-600 hover:underline">
                      <Pencil className="inline-block w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(as.id)} className="text-red-600 hover:underline">
                      <Trash2 className="inline-block w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1 rounded border disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" /> Précédent
        </button>
        <div>Page {page} / {totalPages}</div>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1 rounded border disabled:opacity-50"
        >
          Suivant <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ArticleSupplierList;