import express from "express";
const router = express.Router();
import { bookService, getBookings, getUserBookings, updateBookingStatus, trackBooking } from "../controllers/bookingController.js";

router.post("/",bookService);
router.get("/track", trackBooking);
router.get("/",getBookings);
router.get("/user/:userId", getUserBookings);
router.put("/:id/status", updateBookingStatus);

export default router;