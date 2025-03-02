import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { formatDate, formatTime } from "../utils/date.js";
import { useAttendanceStore } from "../store/attendanceStore";
import { requestLocation } from "../utils/location.js";
import { useAuthStore } from "../store/authStore.js";

const AttendancePage = () => {
  const { user } = useAuthStore();
  const { attendances, getAttendance } = useAttendanceStore();

  useEffect(() => {
    getAttendance(user._id);
  }, [getAttendance]);
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
      <div className="space-y-6 overflow-y-auto max-h-96">
        <h3 className="text-xl font-semibold text-green-400 mb-3">
          User : {user.name}
        </h3>
        {attendances?.map((attendance) => {
          return (
            <motion.div
              key={attendance._id}
              className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-row items-center w-full justify-between">
                <h4 className="text-lg font-semibold text-green-200">
                  {formatDate(attendance.createdAt)}
                </h4>
                <div
                  className={`${
                    attendance.status === "early"
                      ? "bg-green-500/50 text-green-300"
                      : attendance.status === "on-time"
                      ? "bg-green-500/50 text-green-300"
                      : attendance.status === "late"
                      ? "bg-yellow-500/50 text-yellow-300"
                      : attendance.status === "absent"
                      ? "bg-red-500/50 text-red-300"
                      : "bg-gray-500"
                  } px-2 py-1 rounded-lg `}
                >
                  <p className="text-md">{attendance.status}</p>
                </div>
              </div>
              <p className="text-gray-300">
                Clock in :{" "}
                {attendance.clockInTime
                  ? formatTime(attendance.clockInTime)
                  : "No clock in yet"}
              </p>
              <p className="text-gray-300">
                Clock out :{" "}
                {attendance.clockOutTime
                  ? formatTime(attendance.clockOutTime)
                  : "No clock out yet"}
              </p>
            </motion.div>
          );
        })}
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
