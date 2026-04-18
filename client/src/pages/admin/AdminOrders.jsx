import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/Spinner";
import OrderRow from "../../components/OrderRow";

/**
 * AdminOrders Component
 * Renders all customer orders and allows admin to update order status.
 * Props: none
 */
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/orders");
      setOrders(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order status");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-amber-900">Admin Orders</h1>

      {isLoading ? (
        <Spinner label="Loading orders..." />
      ) : (
        <div className="overflow-x-auto rounded-panel border border-amber-200 bg-white/90">
          <table className="min-w-full text-sm">
            <thead className="bg-amber-50 text-left text-amber-900">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order._id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
