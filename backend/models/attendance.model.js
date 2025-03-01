import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: { type: String, required: true },
    clockInTime: { type: Date, required: true },
    clockOutTime: { type: Date },
    status: {
      type: String,
      enum: ["on-time", "late", "early", "absent"],
      required: true,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", AttendanceSchema);
