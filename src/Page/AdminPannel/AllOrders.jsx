import { useFetchData } from '../../hooks/useFetchData';
import { useUpdateData } from '../../hooks/useUpdateData';

const AllOrders = () => {
  const { data, isLoading, error } = useFetchData('orders', '/orders');
  const { mutate: updateOrderStatus, isLoading: isUpdating } = useUpdateData('/orders');

  const orders = data && Array.isArray(data.orders) ? data.orders : [];

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus({ id: orderId, data: { status: newStatus } }); // Only send status
  };

  if (isLoading) return <div className="p-8 text-lg text-gray-600">Loading orders...</div>;
  if (error) return <div className="p-8 text-lg text-red-600">Failed to load orders.</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id ? String(order._id).slice(-8) : '--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{order.customer?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{order.customer?.email || 'No email'}</div>
                    <div className="text-xs text-gray-500">{order.customer?.phone || 'No phone'}</div>
                    {order.shipping && (
                      <div className="mt-1 text-xs text-gray-400">
                        <div>{order.shipping.address || ''}</div>
                        <div>{order.shipping.city || ''}{order.shipping.city && order.shipping.country ? ', ' : ''}{order.shipping.country || ''}</div>
                        <div>{order.shipping.zipCode ? 'ZIP: ' + order.shipping.zipCode : ''}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-BD') : ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.products?.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {order.products.map((product, idx) => (
                          <li key={idx}>
                            {product.name} (×{product.quantity})
                          </li>
                        ))}
                      </ul>
                    ) : 'No products'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ৳{order.orderTotal?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status || 'processing'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      disabled={isUpdating}
                    >
                      <option value="processing">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;