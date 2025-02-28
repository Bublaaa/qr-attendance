import express from "express";
import {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/create", createAttendance);
router.get("/get", getAttendance);
router.post("/update:id", updateAttendance);
router.post("/delete:id", deleteAttendance);

export default router;
