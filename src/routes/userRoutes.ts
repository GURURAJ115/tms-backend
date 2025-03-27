import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.use(authenticateUser);

router.get("/profile",getUserProfile);
router.put("/profile",updateUserProfile);

export default router;