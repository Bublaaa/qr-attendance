import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useAttendanceStore = create((set) => ({
  attendances: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  message: null,

  getAttendance: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}attendance/get`);
      console.log(response);
      set({
        attendances: response.attendances,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching attendances";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createAttendance: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}attendance/create`, {
        userId,
      });
      set({ attendances: response.attendances, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error create attendance";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },
  updateAttendance: async () => {
    set({ isLoading: false, error: null });
    try {
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error update attendance";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },
  deleteAttendance: async () => {
    set({ isLoading: false, error: null });
    try {
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error delete attendance";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },
}));
