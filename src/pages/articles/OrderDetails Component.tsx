import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  Truck, 
  DollarSign, 
  User, 
  MapPin,
  Edit,
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useGetOrderByIdQuery } from '../../redux/api/orderApi';

const OrderDetails = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(id);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading order details</h3>
        <Link 
          to="/dashboard/orders" 
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/dashboard/orders" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Order {order.order_number}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Created on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
              {order.status}
            </span> */}
            {/* <button className="p-2 text-gray-400 hover:text-gray-600">
              <Edit className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 className="h-5 w-5" />
            </button> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {order.order_items?.map((item, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.article_name || item.description}
                      </h4>
                      {/* <p className="text-sm text-gray-500">
                        SKU: {item.product_sku || 'N/A'}
                      </p> */}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${item.unit_price} × {item.quantity_ordered}
                      </p>
                      <p className="text-sm text-gray-500">
                        Subtotal: ${(item.unit_price * item.quantity_ordered).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Total */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">${order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Order Notes</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Order ID</p>
                  <p className="text-sm text-gray-500">{order.id}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Expected Delivery</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.expected_delivery_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Value</p>
                  <p className="text-sm text-gray-500">${order.total_amount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Supplier</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Company</p>
                  <p className="text-sm text-gray-500">{order.supplier_name}</p>
                </div>
              </div>
              
              {order.supplier_contact && (
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Contact</p>
                    <p className="text-sm text-gray-500">{order.supplier_contact}</p>
                  </div>
                </div>
              )}
              
              {order.supplier_address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-500">{order.supplier_address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Information */}
          {order.delivery_address && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Delivery Address</h3>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <p className="text-sm text-gray-700">{order.delivery_address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;