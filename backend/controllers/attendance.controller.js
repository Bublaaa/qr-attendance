import { Attendance } from "../models/attendance.model.js";
import { generateSessionId } from "../utils/generateSessionId.js";
import QRCode from "qrcode";
import { requestLocation } from "../../frontend/src/utils/location.js";

const getStatus = (clockIn) => {
  const clockInTime = new Date();
  clockInTime.setHours(8, 0, 0, 0); // Set clock-in time to 08:00 AM

  const diffMinutes = (clockInTime - clockIn) / (1000 * 60);

  if (diffMinutes > 30) return "absent";
  if (diffMinutes > 0) return "late";
  if (diffMinutes >= -10 && diffMinutes <= 0) return "early";
  if (diffMinutes >= -5 && diffMinutes <= 0) return "on-time";
  return "on-time";
};

export const createAttendance = async (req, res) => {
  const { userId, location } = req.body;
  const { sessionId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    const todaySessionId = `${today}-session`;

    if (sessionId !== todaySessionId) {
      return res
        .status(400)
        .json({ success: false, message: "Session ID does not match" });
    }

    // Request location permission
    let latitude = location.latitude;
    let longitude = location.longitude;

    // Check if user has already clocked in
    let attendance = await Attendance.findOne({
      userId,
      sessionId,
      clockOutTime: null,
    });

    if (attendance) {
      attendance.clockOutTime = new Date();
      await attendance.save();

      return res.status(200).json({
        success: true,
        message: "Clock-out successful",
        attendance,
      });
    } else {
      attendance = new Attendance({
        userId,
        sessionId,
        clockInTime: new Date(),
        clockOutTime: null,
        status: getStatus(new Date()),
        latitude,
        longitude,
      });

      await attendance.save();

      return res.status(201).json({
        success: true,
        message: "Clock-in successful",
        attendance,
      });
    }
  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendance = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const attendances = await Attendance.find({ userId });
    if (!attendances || attendances.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No attendance records found" });
    }
    res.status(200).json({ success: true, attendances: attendances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceToday = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendances = await Attendance.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendances.length) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found for today",
      });
    }
    res.status(200).json({ success: true, attendances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { clockInTime, clockOutTime, status } = req.body;

  try {
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // Validation: clock-out must be after clock-in
    if (clockOutTime && new Date(clockOutTime) <= new Date(clockInTime)) {
      return res.status(400).json({
        success: false,
        message: "clock-out time must be after clock-in time",
      });
    }

    // Update fields only if provided
    if (clockInTime) attendance.clockInTime = new Date(clockInTime);
    if (clockOutTime) attendance.clockOutTime = new Date(clockOutTime);
    if (status) attendance.status = status;

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Attendance record updated successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const attendance = await Attendance.findByIdAndDelete(attendanceId);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateQrCode = async (req, res) => {
  const API_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5002/api/"
      : "/api/";

  try {
    const sessionId = generateSessionId();
    const attendanceUrl = `${API_URL}attendance/create/${sessionId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(attendanceUrl);

    res.status(200).json({
      success: true,
      sessionId,
      qrCode: qrCodeDataUrl, // Base64 image
      attendanceUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate QR Code",
      error: error.message,
    });
  }
};
