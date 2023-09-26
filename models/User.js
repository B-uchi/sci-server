import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, min: 2, max: 50 },
    lastName: { type: String, required: true, min: 2, max: 50 },
    email: { type: String, required: true, unique: true, max: 50 },
    password: { type: String, required: true, min: 5 },
    location: String,
    plan: {
      type: Object,
      required: false,
      default: { selectedPlan: null, status: false },
    },
    transactions: { type: Array, default: [] },
    balance: { type: Number, default: 0 },
    ip: String,
  },
  { timestamps: true }
);

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, min: 2, max: 50 },
    password: { type: String, required: true, min: 5 },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
export const AdminUser = mongoose.model("adminUser", adminUserSchema);
