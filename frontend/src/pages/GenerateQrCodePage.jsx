import { motion } from "framer-motion";
import { formatDate } from "../utils/date.js";
import { useAuthStore } from "../store/authStore.js";
import { useAttendanceStore } from "../store/attendanceStore.js";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

const GenerateQrCodePage = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };
  const { qrCode, url, error, isLoading, fetchQrCode } = useAttendanceStore();
  useEffect(() => {
    fetchQrCode();
  }, [fetchQrCode]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-white bg-clip-text">
        QR Code Today
      </h2>

      {qrCode ? (
        <div className="flex justify-center items-center">
          <img src={qrCode} alt="Attendance QR Code" className="w-48 h-48" />
        </div>
      ) : (
        <h2 className="text-center text-red-500">{error}</h2>
      )}
    </motion.div>
  );
};

export default GenerateQrCodePage;
