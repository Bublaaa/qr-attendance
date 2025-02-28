import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date },
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
