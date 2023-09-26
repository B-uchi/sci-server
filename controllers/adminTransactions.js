import Transaction from "../models/transaction.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

export const fetchAdminTransactions = async (req, res) => {
  try {
    const allTransactions = await Transaction.find();
    res.status(200).json({ transactions: allTransactions });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const approveTransactions = async (req, res) => {
  try {
    const { userEmail, trans_id, amount } = req.body;
    const user = await User.findOne({ email: userEmail });
    User.updateOne(
      { _id: new mongoose.Types.ObjectId(user._id) },
      {
        $set: {
          "transactions.$[transaction].status": true,
        },
      },
      {
        arrayFilters: [
          {
            "transaction._id": new mongoose.Types.ObjectId(trans_id),
          },
        ],
      }
    )
      .then((doc) => {
        
      })
      .catch((err) => {
        console.log(err);
      });
    const transaction = await Transaction.findOne({ _id: trans_id });
    if (transaction.status===true){
      res.status(400).send({ message: "Transaction alreeady verified" })
    }
    user.balance += amount;
    transaction.status = true;
    await transaction.save();
    await user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
