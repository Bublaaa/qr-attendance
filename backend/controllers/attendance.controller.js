import { Attendance } from "../models/attendance.model.js";

const getStatus = (checkInTime) => {
  const clockInTime = new Date();
  clockInTime.setHours(8, 0, 0, 0); // Set clock-in time to 08:00 AM

  const diffMinutes = (checkInTime - clockInTime) / (1000 * 60);

  if (diffMinutes > 30) return "absent";
  if (diffMinutes > 0) return "late";
  if (diffMinutes >= -10 && diffMinutes <= 0) return "early";
  if (diffMinutes >= -5 && diffMinutes <= 0) return "on-time";
  return "on-time";
};

const requestLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        } else {
          reject(new Error("Location permission denied"));
        }
      })
      .catch((error) => reject(error));
  });
};

export const createAttendance = async (req, res) => {
  const { userId } = req.body;

  try {
    const checkInTime = new Date();
    const status = getStatus(checkInTime);

    let latitude = null;
    let longitude = null;

    // Request location permission
    try {
      const location = await requestLocation();
      latitude = location.latitude;
      longitude = location.longitude;
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Location access is required for attendance",
      });
    }

    // Check if user already checked in
    let attendance = await Attendance.findOne({ userId, checkOutTime: null });

    if (attendance) {
      // Checking out
      attendance.checkOutTime = new Date();
      await attendance.save();

      return res.status(200).json({
        success: true,
        message: "Check-out successful",
        attendance,
      });
    } else {
      // Checking in
      attendance = new Attendance({
        userId,
        checkInTime,
        checkOutTime: null,
        status,
        latitude,
        longitude,
      });

      await attendance.save();

      return res.status(201).json({
        success: true,
        message: "Check-in successful",
        attendance,
      });
    }
  } catch (error) {
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
    const attendances = Attendance.find;
    if (attendances.length < 0 || !attendances) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to retrieve data" });
    }

    res.status(200).json({ success: true, attendances });
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
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
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
  const { checkInTime, checkOutTime, status } = req.body;

  try {
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // Validation: Check-out must be after check-in
    if (checkOutTime && new Date(checkOutTime) <= new Date(checkInTime)) {
      return res.status(400).json({
        success: false,
        message: "Check-out time must be after check-in time",
      });
    }

    // Update fields only if provided
    if (checkInTime) attendance.checkInTime = new Date(checkInTime);
    if (checkOutTime) attendance.checkOutTime = new Date(checkOutTime);
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
