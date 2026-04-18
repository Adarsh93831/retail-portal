import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,

  /**
   * Logs in the user and stores user profile in state.
   */
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.post("/auth/login", { email, password });

      set({
        user: response.data.data.user,
        isLoggedIn: true,
        isLoading: false,
      });

      return { success: true, data: response.data.data.user };
    } catch (error) {
      set({ isLoading: false, user: null, isLoggedIn: false });
      return {
        success: false,
        message: error.response?.data?.message || "Login failed.",
      };
    }
  },

  /**
   * Registers a new user and stores user profile in state.
   */
  register: async (name, email, password) => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.post("/auth/register", { name, email, password });

      set({
        user: response.data.data.user,
        isLoggedIn: true,
        isLoading: false,
      });

      return { success: true, data: response.data.data.user };
    } catch (error) {
      set({ isLoading: false, user: null, isLoggedIn: false });
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed.",
      };
    }
  },

  /**
   * Logs out the active user and clears auth state.
   */
  logout: async () => {
    set({ isLoading: true });

    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null, isLoggedIn: false, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed.",
      };
    }
  },

  /**
   * Restores logged-in user session from server cookie.
   */
  fetchMe: async () => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.get("/auth/me");
      set({
        user: response.data.data.user,
        isLoggedIn: true,
        isLoading: false,
      });

      return { success: true, data: response.data.data.user };
    } catch (error) {
      set({ user: null, isLoggedIn: false, isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Session restore failed.",
      };
    }
  },
}));

export default useAuthStore;
