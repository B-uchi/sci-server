import { User } from "../models/User.js";
import { Plan } from "../models/plan.js";
import cron from "node-cron";
import Transaction from "../models/transaction.js";

export const registerPlan = async (req, res) => {
  try {
    const { email, planID, amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Invalid amount" });
    const user = await User.findOne({ email });
    if (user.plan.status) {
      return res.status(400).send({ message: "Plan already registered" });
    } else {
      const plan = await Plan.findOne({ id: planID });
      const minDeposit = plan.minDeposit;
      if (user.balance > minDeposit) {
        user.plan.status = true;
        user.plan.amount = Number(amount);
        user.plan.daysleft = Number(30);
        user.plan.balance = Number(amount);
        user.plan.percent = plan.profit / 100 / 30;
        const deposit = new Transaction({
          email: email,
          to: "PLAN DEPOSIT",
          coin: `${plan.title} plan deposit`,
          coin_amt: amount,
          amt: amount,
          status: true,
        });
        const savedTransaction = await deposit.save();
        user.plan.addedAmt = user.plan.percent * user.plan.amount;
        user.balance -= Number(amount);
        user.markModified("plan");
        user.markModified("balance");
        await user.save();
        const updatebal = cron.schedule("* * * * *", async () => {
          user.plan.daysleft += -1;
          user.plan.balance += user.plan.addedAmt;
          console.log("Cron Succesfull");
          user.markModified("plan");
          await user.save();
          if (user.plan.daysleft === 0) {
            updatebal.stop();
            return res.sendStatus(202);
          }
        });
        updatebal.start();
        return res.sendStatus(200);
      } else {
        return res.status(400).json({ message: "Insufficient balance" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
