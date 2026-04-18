import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import AIGenerateButton from "../../components/AIGenerateButton";

/**
 * ProductForm Component
 * Renders create/edit product form with optional AI description generation.
 * Props: none
 */
const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    cost: "",
    taxPercent: "18",
    category: "",
    stock: "0",
    isAvailable: true,
    addOnsText: "[]",
    combosText: "[]",
  });

  const isEdit = Boolean(id);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const fetchProductForEdit = async () => {
    if (!isEdit) {
      return;
    }

    try {
      const response = await axiosInstance.get(`/products/${id}`);
      const product = response.data.data;

      setForm({
        title: product.title,
        description: product.description,
        cost: product.cost,
        taxPercent: product.taxPercent,
        category: product.category?._id || product.category,
        stock: product.stock,
        isAvailable: product.isAvailable,
        addOnsText: JSON.stringify(product.addOns || [], null, 2),
        combosText: JSON.stringify(product.combos || [], null, 2),
      });
    } catch (error) {
      toast.error("Failed to load product details");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductForEdit();
  }, [id]);

  const handleGenerateWithAI = async () => {
    if (!form.title.trim()) {
      toast.error("Please enter product title first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axiosInstance.post("/ai/generate-product-details", {
        title: form.title,
      });

      const aiData = response.data.data;

      setForm((prev) => ({
        ...prev,
        description: aiData.description || prev.description,
        taxPercent: aiData.taxPercent ?? prev.taxPercent,
        addOnsText: JSON.stringify(aiData.suggestedAddOns || [], null, 2),
      }));

      toast.success("AI details generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "AI generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      JSON.parse(form.addOnsText || "[]");
      JSON.parse(form.combosText || "[]");
    } catch (error) {
      toast.error("Add-ons and Combos must be valid JSON arrays");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("cost", form.cost);
      payload.append("taxPercent", form.taxPercent);
      payload.append("category", form.category);
      payload.append("stock", form.stock);
      payload.append("isAvailable", form.isAvailable);
      payload.append("addOns", form.addOnsText);
      payload.append("combos", form.combosText);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (isEdit) {
        await axiosInstance.put(`/products/${id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await axiosInstance.post("/products", payload);
        toast.success("Product created successfully");
      }

      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-amber-900">{isEdit ? "Edit Product" : "Create Product"}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-amber-900">Title</label>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
              className="w-full rounded-lg border border-amber-300 px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <AIGenerateButton onClick={handleGenerateWithAI} isLoading={isGenerating} />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-amber-900">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              required
              className="w-full rounded-lg border border-amber-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-amber-900">Cost</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.cost}
              onChange={(event) => setForm((prev) => ({ ...prev, cost: event.target.value }))}
              required
              className="w-full rounded-lg border border-amber-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-amber-900">Tax Percent</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.taxPercent}
              onChange={(event) => setForm((prev) => ({ ...prev, taxPercent: event.target.value }))}
              className="w-full rounded-lg border border-amber-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-amber-900">Category</label>
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              required
              className="w-full rounded-lg border border-amber-300 px-3 py-2"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-amber-900">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
              className="w-full rounded-lg border border-amber-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-amber-900">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              className="w-full rounded-lg border border-amber-300 px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="isAvailable"
              type="checkbox"
              checked={form.isAvailable}
              onChange={(event) => setForm((prev) => ({ ...prev, isAvailable: event.target.checked }))}
            />
            <label htmlFor="isAvailable" className="text-sm font-semibold text-amber-900">
              Is Available
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-amber-900">Add-ons (JSON array)</label>
            <textarea
              rows={5}
              value={form.addOnsText}
              onChange={(event) => setForm((prev) => ({ ...prev, addOnsText: event.target.value }))}
              className="w-full rounded-lg border border-amber-300 px-3 py-2 font-mono text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-amber-900">Combos (JSON array)</label>
            <textarea
              rows={5}
              value={form.combosText}
              onChange={(event) => setForm((prev) => ({ ...prev, combosText: event.target.value }))}
              className="w-full rounded-lg border border-amber-300 px-3 py-2 font-mono text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
