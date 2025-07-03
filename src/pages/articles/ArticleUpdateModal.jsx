import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Upload, Package, AlertTriangle } from 'lucide-react';

const ArticleUpdateModal = ({ 
  article, 
  isOpen, 
  onClose, 
  onUpdate, 
  isUpdating = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    quantity: 0,
    unit_price: 0,
    critical_threshold: 0,
    description: '',
    image: ''
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize form with article data
  useEffect(() => {
    if (article) {
      setFormData({
        name: article.name || '',
        reference: article.reference || '',
        quantity: article.quantity || 0,
        unit_price: article.unit_price || 0,
        critical_threshold: article.critical_threshold || 0,
        description: article.description || '',
        image: article.image || ''
      });
      setImagePreview(article.image || null);
    }
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'article est requis';
    }
    
    if (!formData.reference.trim()) {
      newErrors.reference = 'La référence est requise';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'La quantité ne peut pas être négative';
    }
    
    if (formData.unit_price <= 0) {
      newErrors.unit_price = 'Le prix unitaire doit être supérieur à 0';
    }
    
    if (formData.critical_threshold < 0) {
      newErrors.critical_threshold = 'Le seuil critique ne peut pas être négatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate(formData);
    }
  };

  const isCritical = formData.quantity <= formData.critical_threshold;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Fermer</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <Package className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Modifier l'Article
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Mettez à jour les informations de l'article "{article?.name}"
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nom de l'article */}
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom de l'article *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                  placeholder="Entrez le nom de l'article"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Référence */}
              <div>
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                  Référence *
                </label>
                <input
                  type="text"
                  name="reference"
                  id="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.reference ? 'border-red-300' : ''
                  }`}
                  placeholder="REF-001"
                />
                {errors.reference && (
                  <p className="mt-1 text-sm text-red-600">{errors.reference}</p>
                )}
              </div>

              {/* Prix unitaire */}
              <div>
                <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700">
                  Prix unitaire ($) *
                </label>
                <input
                  type="number"
                  name="unit_price"
                  id="unit_price"
                  min="0"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.unit_price ? 'border-red-300' : ''
                  }`}
                />
                {errors.unit_price && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit_price}</p>
                )}
              </div>

              {/* Quantité */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantité en stock
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.quantity ? 'border-red-300' : ''
                  }`}
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>

              {/* Seuil critique */}
              <div>
                <label htmlFor="critical_threshold" className="block text-sm font-medium text-gray-700">
                  Seuil critique
                </label>
                <input
                  type="number"
                  name="critical_threshold"
                  id="critical_threshold"
                  min="0"
                  value={formData.critical_threshold}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.critical_threshold ? 'border-red-300' : ''
                  }`}
                />
                {errors.critical_threshold && (
                  <p className="mt-1 text-sm text-red-600">{errors.critical_threshold}</p>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Description détaillée de l'article..."
                />
              </div>

              {/* Image */}
              <div className="sm:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image de l'article
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {imagePreview && (
                    <div className="flex-shrink-0">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu" 
                        className="h-20 w-20 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="border-2 border-gray-300 border-dashed rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Cliquez pour télécharger une image
                        </p>
                      </div>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Alert */}
            {isCritical && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Stock critique
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        La quantité actuelle ({formData.quantity}) est inférieure ou égale au seuil critique ({formData.critical_threshold}). 
                        Envisagez de réapprovisionner cet article.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                disabled={isUpdating}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};