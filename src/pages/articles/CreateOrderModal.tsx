import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Package, Calendar, User, Hash } from 'lucide-react';
import { useAddOrderMutation } from '../../redux/api/orderApi';
import { useGetArticleQuery, useGetArticlesQuery } from '../../redux/api/articlesApi';
import { useGetFournisseursQuery } from '../../redux/api/authApi';
// Assuming you have these APIs for fetching suppliers and articles
// import { useGetSuppliersQuery } from '../../redux/api/suppliersApi';
// import { useGetArticlesQuery } from '../../redux/api/articlesApi';

interface OrderItem {
  article: number;
  quantity_ordered: number;
  unit_price: number;
}

interface CreateOrderData {
  supplier: number;
  status: string;
  order_date: string;
  order_number: string;
  expected_delivery_date: string;
  actual_delivery_date: null;
  order_items: OrderItem[];
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateOrderData>({
    supplier: 0,
    status: 'pending',
    order_date: new Date().toISOString().split('T')[0],
    order_number: '',
    expected_delivery_date: '',
    actual_delivery_date: null,
    order_items: [{ article: 0, quantity_ordered: 1, unit_price: 0 }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [addOrder, { isLoading: isCreating }] = useAddOrderMutation();
//   const { data: suppliersData } = useGetSuppliersQuery();
  const { data: fournisseursData, isLoading: fournisseursLoading } = useGetFournisseursQuery();

  const { data: articlesData } = useGetArticleQuery();
  

  // Generate order number when modal opens
  useEffect(() => {
    if (isOpen && !formData.order_number) {
      const now = new Date();
      const orderNumber = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, order_number: orderNumber }));
    }
  }, [isOpen, formData.order_number]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplier) {
      newErrors.supplier = 'Supplier is required';
    }
    if (!formData.order_number.trim()) {
      newErrors.order_number = 'Order number is required';
    }
    if (!formData.expected_delivery_date) {
      newErrors.expected_delivery_date = 'Expected delivery date is required';
    }
    if (formData.order_items.length === 0) {
      newErrors.order_items = 'At least one item is required';
    }

    formData.order_items.forEach((item, index) => {
      if (!item.article) {
        newErrors[`item_${index}_article`] = 'Article is required';
      }
      if (item.quantity_ordered <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unit_price <= 0) {
        newErrors[`item_${index}_price`] = 'Unit price must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await addOrder(formData).unwrap();
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      supplier: 0,
      status: 'pending',
      order_date: new Date().toISOString().split('T')[0],
      order_number: '',
      expected_delivery_date: '',
      actual_delivery_date: null,
      order_items: [{ article: 0, quantity_ordered: 1, unit_price: 0 }]
    });
    setErrors({});
    onClose();
  };

  const addOrderItem = () => {
    setFormData(prev => ({
      ...prev,
      order_items: [...prev.order_items, { article: 0, quantity_ordered: 1, unit_price: 0 }]
    }));
  };

  const removeOrderItem = (index: number) => {
    if (formData.order_items.length > 1) {
      setFormData(prev => ({
        ...prev,
        order_items: prev.order_items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: number) => {
    setFormData(prev => ({
      ...prev,
      order_items: prev.order_items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotal = () => {
    return formData.order_items.reduce((total, item) => 
      total + (item.quantity_ordered * item.unit_price), 0
    ).toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Create New Order</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline h-4 w-4 mr-1" />
                Order Number
              </label>
              <input
                type="text"
                value={formData.order_number}
                onChange={(e) => setFormData(prev => ({ ...prev, order_number: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter order number"
              />
              {errors.order_number && (
                <p className="mt-1 text-sm text-red-600">{errors.order_number}</p>
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Supplier
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={0}>Select a supplier</option>
                {fournisseursData?.map((supplier: any) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.username}
                  </option>
                ))}
              </select>
              {errors.supplier && (
                <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>
              )}
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Order Date
              </label>
              <input
                type="date"
                value={formData.order_date}
                onChange={(e) => setFormData(prev => ({ ...prev, order_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={formData.expected_delivery_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.expected_delivery_date && (
                <p className="mt-1 text-sm text-red-600">{errors.expected_delivery_date}</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                <Package className="inline h-5 w-5 mr-2" />
                Order Items
              </h4>
              <button
                type="button"
                onClick={addOrderItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>

            {errors.order_items && (
              <p className="mb-4 text-sm text-red-600">{errors.order_items}</p>
            )}

            <div className="space-y-4">
              {formData.order_items.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Article */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Article
                      </label>
                      <select
                        value={item.article}
                        onChange={(e) => updateOrderItem(index, 'article', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value={0}>Select an article</option>
                        {articlesData?.map((article: any) => (
                          <option key={article.id} value={article.id}>
                            {article.name}
                          </option>
                        ))}
                      </select>
                      {errors[`item_${index}_article`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_article`]}</p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity_ordered}
                        onChange={(e) => updateOrderItem(index, 'quantity_ordered', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unit_price}
                          onChange={(e) => updateOrderItem(index, 'unit_price', Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      {errors[`item_${index}_price`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_price`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Item Actions */}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <div className="text-sm text-gray-600">
                      Total: <span className="font-medium">${(item.quantity_ordered * item.unit_price).toFixed(2)}</span>
                    </div>
                    {formData.order_items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOrderItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Order Total:</span>
                <span className="text-xl font-bold text-primary-600">${calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
