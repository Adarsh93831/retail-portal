import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import CategoryTable from "../../components/CategoryTable";
import Spinner from "../../components/Spinner";

/**
 * ManageCategories Component
 * Renders admin categories list with create, edit, and delete actions.
 * Props: none
 */
const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-amber-900">Manage Categories</h1>
        <Link
          to="/admin/categories/new"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Add New Category
        </Link>
      </div>

      {isLoading ? (
        <Spinner label="Loading categories..." />
      ) : (
        <CategoryTable categories={categories} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ManageCategories;
