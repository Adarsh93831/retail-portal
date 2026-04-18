import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import ProductTable from "../../components/ProductTable";
import Spinner from "../../components/Spinner";

/**
 * ManageProducts Component
 * Renders admin products list with create, edit, and delete actions.
 * Props: none
 */
const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/products", {
        params: { page: 1, limit: 100 },
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

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-amber-900">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Add New Product
        </Link>
      </div>

      {isLoading ? <Spinner label="Loading products..." /> : <ProductTable products={products} onDelete={handleDelete} />}
    </div>
  );
};

export default ManageProducts;
