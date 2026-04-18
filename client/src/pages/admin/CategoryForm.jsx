import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

/**
 * CategoryForm Component
 * Renders create/edit category form with optional logo upload.
 * Props: none
 */
const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategoryForEdit = async () => {
    if (!isEdit) {
      return;
    }

    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      setName(response.data.data.name || "");
      setDescription(response.data.data.description || "");
    } catch (error) {
      toast.error("Failed to load category details");
    }
  };

  useEffect(() => {
    fetchCategoryForEdit();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", name);
      payload.append("description", description);

      if (logoFile) {
        payload.append("logo", logoFile);
      }

      if (isEdit) {
        await axiosInstance.put(`/categories/${id}`, payload);
        toast.success("Category updated successfully");
      } else {
        await axiosInstance.post("/categories", payload);
        toast.success("Category created successfully");
      }

      navigate("/admin/categories");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-amber-900">{isEdit ? "Edit Category" : "Create Category"}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-amber-900">Category Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-lg border border-amber-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-amber-900">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border border-amber-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-amber-900">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setLogoFile(event.target.files?.[0] || null)}
            className="w-full rounded-lg border border-amber-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
