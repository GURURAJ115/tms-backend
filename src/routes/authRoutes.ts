import express from 'express';
import { signup} from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { signupSchema} from '../validations/authValidations';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signup);

export default router;