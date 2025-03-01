import express from "express";
import {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  generateQrCode,
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/create/:sessionId", createAttendance);
router.get("/get", getAttendance);
router.post("/update:id", updateAttendance);
router.post("/delete:id", deleteAttendance);
router.get("/generate-qr", generateQrCode);

export default router;
