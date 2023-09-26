import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    id: {type: Number, required: true},
    title: { type: String, required: true },
    subHeader: { type: String},
    profit: { type: Number, required: true },
    minDeposit: { type: Number, required: true },
    description: { type: Array, required: true},
  },
  { timestamps: true }
);

export const Plan = mongoose.model("Plan", planSchema);
