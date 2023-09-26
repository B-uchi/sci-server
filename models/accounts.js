import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true },
    currency: { type: String, required: true },
    addresses: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);
export default Account;
