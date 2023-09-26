import Account from "../models/accounts.js";

export const addWallet = async (req, res) => {
  try {
    const { symbol, currency, address } = req.body;
    const checkWallet = await Account.findOne({ symbol });
    if (checkWallet) {
      if (!checkWallet.addresses.includes(address)) {
        checkWallet.addresses.push(address);
        checkWallet.save();
        return res.sendStatus(201);
      } else {
        return res.status(400).send({ message: "Address already added" });
      }
    } else {
      const wallet = new Account({ symbol, currency });
      wallet.addresses.push(address);
      const savedWallet = await wallet.save();
      console.log(`${symbol} wallet added successfully`);
      return res.send(201).send();
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const fetchWallets = async (req, res) => {
  try {
    const wallets = await Account.find({});
    let returnedWallet = [];
    await Promise.all(
      wallets.map((wallet) => {
        wallet.addresses = "";
        returnedWallet.push(wallet);
      })
    );
    return res.status(200).json({ wallets: returnedWallet });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
export const adminFetchWallets = async (req, res) => {
  try {
    const wallets = await Account.find({});
    return res.status(200).json({ wallets });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
