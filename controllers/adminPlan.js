import { User } from "../models/User.js";
import { Plan } from "../models/plan.js";

export const createPlan = async (req, res) => {
  try {
    const { id, title, subHeader, profit, minDeposit, description } = req.body;
    const newPlan = new Plan({
      id,
      title,
      subHeader,
      profit,
      minDeposit,
      description,
    });
    const savedPlan = await newPlan.save();
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const fetchPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    return res.status(200).json({ plans });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const setUserPlan = async (req, res) => {
  try {
    const { email, planID } = req.body;
    const user = await User.findOne({ email });

    const planObj = user.plan;
    planObj.selectedPlan = planID;
    user.markModified("plan");
    user.save();
    const plan = await Plan.findOne({ id: planID });
    return res.status(200).json({ min: plan.minDeposit });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const deletePlans = async (req, res) => {
  try {
    const { id } = req.body;
    const plans = await Plan.findOneAndDelete({ id });
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
