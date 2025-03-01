import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAttendanceStore } from "../store/attendanceStore";
import { requestLocation } from "../utils/location.js";
import { useAuthStore } from "../store/authStore.js";
import QrScanner from "../components/QrScanner";

const AttendancePage = () => {
  const { user } = useAuthStore();
  const { attendances, message, handleScanSuccess } = useAttendanceStore();
  const [locationGranted, setLocationGranted] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const coords = await requestLocation();
        setLocation(coords);
        setLocationGranted(true);
      } catch (error) {
        console.error("Location permission denied:", error);
        setLocationGranted(false);
      }
    };
    checkLocationPermission();
  }, []);

  const handleScan = (data) => {
    console.log(data);
    if (data) {
      handleScanSuccess(data, user._id, location);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-white bg-clip-text">
        Attendance
      </h2>
      <div className="space-y-6">
        <motion.div
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-green-400 mb-3">
            Attendance Today
          </h3>
          {locationGranted === null && <p>Checking location permission...</p>}
          {locationGranted === false && (
            <p>❌ Location permission is required for attendance.</p>
          )}
          {locationGranted === true && <QrScanner onScanSuccess={handleScan} />}
          {location ? (
            <p>
              📍 Location: {location.latitude}, {location.longitude}
            </p>
          ) : (
            <p>Requesting location...</p>
          )}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        <NavLink to={"/"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 px-4 bg-white text-dark font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Back
          </motion.button>
        </NavLink>
      </motion.div>
    </motion.div>
  );
};

export default AttendancePage;
