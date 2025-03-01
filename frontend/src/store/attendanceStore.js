import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useAttendanceStore = create((set) => ({
  qrCode: null,
  url: null,
  attendances: null,
  error: null,
  isLoading: false,
  message: null,

  fetchQrCode: async () => {
    set({ isLoading: true, error: null, qrCode: null, url: null });
    try {
      const response = await axios.get(`${API_URL}attendance/generate-qr`);
      set({
        isLoading: false,
        qrCode: response.data.qrCode,
        url: response.data.attendanceUrl,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching QR Code";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  handleScanSuccess: async (scannedData, userId) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const { sessionId } = JSON.parse(scannedData);
      const attendanceUrl = `${API_URL}attendance/create/${sessionId}`;
      set({ message: "Sending attendance..." });
      console.log(sessionId);
      const response = await axios.post(attendanceUrl, { userId });

      if (response) {
        set({
          attendances: response.data,
          isLoading: false,
          message: "✅ Attendance recorded successfully!",
        });
        toast.success("Attendance recorded successfully!");
      }
    } catch (error) {
      toast.error(error);
      const errorMessage =
        error.response?.data?.message || "❌ Error submitting attendance";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getAttendance: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}attendance/get`, { userId });
      set({
        attendances: response.data.attendances,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching attendances";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  getAttendanceToday: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // const response = await axios.get(`${API_URL}attendance/today?userId=${userId}`);

      const response = await axios.get(`${API_URL}attendance/today`, {
        userId,
      });
      console.log(userId);
      set({
        attendances: response.data.attendances,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "No attendance yet";
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
