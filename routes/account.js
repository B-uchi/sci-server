import express from 'express'
import { userDeposit, userTransactions, getUser } from '../controllers/deposit.js'
import { verifyToken } from '../middleware/auth.js';
import { fetchWallets } from '../controllers/adminWallet.js';
import { fetchPlans, setUserPlan } from '../controllers/adminPlan.js';
import { registerPlan } from '../controllers/registerPlan.js';

const router = express.Router();

router.post("/deposit", verifyToken, userDeposit);
router.post("/me", verifyToken, getUser);
router.get("/wallets", verifyToken, fetchWallets);
router.get('/plans', verifyToken, fetchPlans)
// router.get('/plans', login)
router.post('/transactions', verifyToken, userTransactions)
router.post('/plan', verifyToken, setUserPlan)
router.post('/registerPlan', verifyToken, registerPlan)


export default router