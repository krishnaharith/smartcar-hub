import express from "express";
const router = express.Router();
import { registerUser, loginUser, getAllUsers } from "../controllers/userController.js";
import { sendOTP, verifyOTP, resetPassword } from "../controllers/otpController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);

// Forgot password OTP flow
router.post("/forgot-password", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;