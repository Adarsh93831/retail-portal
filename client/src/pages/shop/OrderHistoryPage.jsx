import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import OrderCard from "../../components/OrderCard";
import Spinner from "../../components/Spinner";
import useCartStore from "../../store/cartStore";

/**
 * OrderHistoryPage Component
 * Renders customer order history and provides quick re-order action.
 * Props: none
 */
const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);

  const fetchOrders = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get("/orders/my-orders");
      setOrders(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load order history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      const productFromOrder = {
        _id: item.product?._id || item.product,
        title: item.title,
        image: item.image,
        cost: item.priceAtOrder,
        taxPercent: 0,
      };

      addItem(productFromOrder, item.quantity, item.selectedAddOns || []);
    });

    toast.success("Items re-added to cart");
  };

  if (isLoading) {
    return <Spinner label="Loading your orders..." />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold text-amber-900">Order History</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-amber-800/80">No orders found yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} onReorder={handleReorder} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
