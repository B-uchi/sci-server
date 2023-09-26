import express from 'express'
import { verifyToken } from '../middleware/auth.js';
import { fetchAdminTransactions, approveTransactions, getUsers } from '../controllers/adminTransactions.js';
import { registerAdmin, loginAdmin } from '../controllers/adminAuth.js';
import { addWallet, adminFetchWallets } from '../controllers/adminWallet.js';
import { createPlan, deletePlans, fetchPlans } from '../controllers/adminPlan.js';

const router = express.Router();

// router.post("/deposit", verifyToken, userDeposit);

router.get('/transactions', verifyToken, fetchAdminTransactions)
router.post('/transactions', verifyToken, approveTransactions)
router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.get('/users', verifyToken, getUsers)
router.post('/wallets', verifyToken, addWallet)
router.get('/adminWallets', verifyToken, adminFetchWallets)
router.post('/createPlan', verifyToken, createPlan)
router.get('/plans', verifyToken, fetchPlans)
router.post('/deletePlan', verifyToken, deletePlans)



export default router