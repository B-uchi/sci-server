import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, max: 50 },
    to: { type: String, required: true },
    coin: { type: String, required: true },
    coin_amt: { type: Number, required: true },
    amt: { type: Number, required: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
