import express from 'express';
import { login, requestOTP, signup } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, phoneSchema, signupSchema } from '../validations/authValidations';

const router = express.Router();

router.post('/request-otp', validateRequest(phoneSchema), requestOTP);
router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);

export default router;