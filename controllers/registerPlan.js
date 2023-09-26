import { User } from "../models/User.js";
import { Plan } from "../models/plan.js";
import cron from "node-cron";

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
        user.plan.daysleft = 30;
        user.plan.balance = Number(amount);
        user.plan.percent = plan.profit / 100 / 30;
        user.plan.addedAmt = user.plan.percent * user.plan.amount;
        user.markModified("plan");
        await user.save();
        cron.schedule("0 1 * * *", async () => {
          user.plan.balance += user.plan.addedAmt;
          user.plan.daysleft -= 1;
          console.log("Cron Succesfull");
          user.markModified("plan");
          await user.save();
          if ((user.plan.daysleft = 0)) {
            return res.sendStatus(202);
          }
        });
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
