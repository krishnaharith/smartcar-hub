import mongoose from "mongoose";
import dotenv from "dotenv";
import Booking from "./models/booking.js";

dotenv.config();

const URL = process.env.MONGO_URL || "mongodb+srv://user123:user123@cluster0.64xfaci.mongodb.net/smartcar?appName=Cluster0";

mongoose.connect(URL)
  .then(async () => {
    console.log("Connected to MongoDB for cleanup...");
    
    // Delete bindings starting with 'Guest_'
    const result = await Booking.deleteMany({ userId: { $regex: /^Guest_/ } });
    console.log(`Deleted ${result.deletedCount} old guest bookings.`);

    mongoose.disconnect();
    console.log("Cleanup complete!");
  })
  .catch((err) => {
    console.error("Cleanup failed", err);
  });
