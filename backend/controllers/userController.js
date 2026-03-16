import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req,res)=>{
  try{
    const {name, email, phone, password, role, adminCode} = req.body;

    // Secure Admin Registration
    let assignedRole = "user";
    if (role === "admin") {
      if (adminCode !== "981245") {
        return res.status(403).json({ message: "Invalid Admin Verification Code!" });
      }
      assignedRole = "admin";
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: assignedRole
    });

    await user.save();

    res.json({message:"User registered successfully"});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
};

export const loginUser = async (req,res)=>{
  try{
    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user) return res.status(404).json({message:"User not found"});

    const valid = await bcrypt.compare(password,user.password);

    if(!valid) return res.status(401).json({message:"Invalid password"});

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    res.json({message:"Login successful", user: userPayload});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};