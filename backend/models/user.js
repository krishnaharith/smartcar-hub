import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  vehicles: [{
    make: String,
    model: String,
    year: Number
  }]
})

export default mongoose.model("User",userSchema)