import mongoose from "mongoose";
import User from "./backend/models/user.js";

mongoose.connect("mongodb://localhost:27017/smartcar")
.then(async () => {
    const users = await User.find({});
    console.log(users);
    process.exit(0);
}).catch(console.error);
