import jwt from "jsonwebtoken";
import Transaction from "../models/transaction.js";
import { User } from "../models/User.js";
import Account from "../models/accounts.js";

export const userDeposit = async (req, res) => {
  try {
    const { email, coin, coin_amt } = req.body;
    if (coin_amt === 0)
      return res.status(400).send({ message: "Can't deposit 0" });
    const amt = coin_amt * 100;
    const wallet = await Account.findOne({ symbol: coin });
    const choices = wallet.addresses;
    let randomNo = Math.floor(Math.random() * choices.length);
    const choice = choices[randomNo];
    const newTransaction = new Transaction({ email, coin_amt, coin, amt, to: choice });
    const savedTransaction = await newTransaction.save();
    const user = await User.findOne({ email: email });
    user.transactions.push(savedTransaction);
    user.save();
    console.log("Transaction pending");
    res.status(201).json({to: choice});
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    res.status(201).json({ userData: userData });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
export const fetchAllTransactions = async (req, res) => {
  try {
    const { email } = req.body;
    const transactionList = await Transaction.find({ email: email });
    res.status(201).json({ transactionList: transactionList });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const userTransactions = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    const transactionList = user.transactions
    res.status(201).json({ transactionList: transactionList });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
