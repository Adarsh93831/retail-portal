import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/Spinner";
import StockRow from "../../components/StockRow";

/**
 * StockManager Component
 * Renders admin stock table with inline stock updates and reasons.
 * Props: none
 */
const StockManager = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/products", {
        params: { page: 1, limit: 200 },
      });
      setProducts(response.data.data.products);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveStock = async (productId, newStock, reason) => {
    try {
      await axiosInstance.put(`/stock/${productId}`, {
        newStock,
        reason,
      });
      toast.success("Stock updated");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update stock");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-amber-900">Stock Manager</h1>

      {isLoading ? (
        <Spinner label="Loading stock data..." />
      ) : (
        <div className="overflow-x-auto rounded-panel border border-amber-200 bg-white/90">
          <table className="min-w-full text-sm">
            <thead className="bg-amber-50 text-left text-amber-900">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Current Stock</th>
                <th className="px-4 py-3">New Stock</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <StockRow key={product._id} product={product} onSave={handleSaveStock} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockManager;
