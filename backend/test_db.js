import mongoose from "mongoose";
import User from "./models/user.js";

mongoose.connect("mongodb+srv://user123:user123@cluster0.64xfaci.mongodb.net/smartcar?appName=Cluster0")
.then(async () => {
    const users = await User.find({});
    console.log("=== USERS IN DATABASE ===");
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
}).catch(console.error);
