import jwt from "jsonwebtoken";
import { AdminUser } from "../models/User.js";
import bcryptjs from "bcryptjs";

// Register user
export const registerAdmin = async (req, res) => {
  try {
    const { email, password} = req.body;

    if (!email & !password) {
      console.log("Incomplete fields");
      return res.status(400).send({ error: "Incomplete credentials" });
    }
    const salt = await bcryptjs.genSalt();
    const passwordHash = await bcryptjs.hash(password, salt);
    const newUser = new AdminUser({
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await AdminUser.findOne({ email: email });
      if (!user) return res.status(400).json({ message: "User does not exist" });
  
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      delete user.ip
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };