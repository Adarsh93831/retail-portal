import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const useProductStore = create((set) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,

  /**
   * Fetches products list with optional filter params and stores latest page in state.
   */
  fetchProducts: async (filters = {}) => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.get("/products", { params: filters });
      const payload = response.data.data;

      set({ products: payload.products, isLoading: false });
      return { success: true, data: payload };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch products.",
      };
    }
  },

  /**
   * Fetches all categories and stores them in product state.
   */
  fetchCategories: async () => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.get("/categories");
      set({ categories: response.data.data, isLoading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch categories.",
      };
    }
  },

  /**
   * Fetches a single product by id and stores it for detail page rendering.
   */
  fetchProductById: async (id) => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.get(`/products/${id}`);
      set({ selectedProduct: response.data.data, isLoading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({ isLoading: false, selectedProduct: null });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch product details.",
      };
    }
  },
}));

export default useProductStore;
