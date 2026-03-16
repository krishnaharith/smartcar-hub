import mongoose from "mongoose";
import dotenv from "dotenv";
import Booking from "./models/booking.js";

dotenv.config();

const URL = process.env.MONGO_URL || "mongodb+srv://user123:user123@cluster0.64xfaci.mongodb.net/smartcar?appName=Cluster0";

mongoose.connect(URL)
  .then(async () => {
    console.log("Connected to database...");
    const bookings = await Booking.find();
    console.log(`Found ${bookings.length} bookings.`);
    console.log(JSON.stringify(bookings, null, 2));
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("DB connection error", err);
  });
