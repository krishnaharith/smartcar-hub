import mongoose from "mongoose";
import Booking from "./models/booking.js";
import User from "./models/user.js";

mongoose.connect("mongodb+srv://:@cluster0.64xfaci.mongodb.net/smartcar?appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB. Creating a test tracking booking...");
    
    // Create a dummy user
    const mockUser = await User.create({
      name: "Test Tracker",
      email: "tracktest@example.com",
      password: "password123",
      phone: "9998887776"
    });

    console.log("Created Mock User:", mockUser._id);

    // Create a dummy booking for that user
    const booking = await Booking.create({
      userId: mockUser._id,
      serviceId: new mongoose.Types.ObjectId(), // fake service ID
      date: new Date(),
      vehicle: "Honda Civic TrackTest",
      trackingStatus: "Service Started" // mid-way status
    });

    console.log("Created Test Booking:", booking._id);
    console.log("Tracking Test Data:");
    console.log(`Phone: 9998887776`);
    console.log(`Vehicle: Honda Civic TrackTest`);
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
