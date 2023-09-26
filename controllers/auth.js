import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";

// Register user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, location } = req.body;
    const ip = req.connection.remoteAddress;

    if (!firstName & !lastName & !email & !password & !location) {
      console.log("Incomplete fields");
      return res.status(400).send({ error: "Incomplete credentials" });
    }
    const salt = await bcryptjs.genSalt();
    const passwordHash = await bcryptjs.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      location,
      ip,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    delete user.ip
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
