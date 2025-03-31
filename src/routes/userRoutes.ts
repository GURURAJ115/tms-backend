import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { applyForVolunteer, getUpcomingEvents, getUserProfile, registerForEvent, updateUserProfile } from '../controllers/userController';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.use(authenticateUser);

router.get("/profile",getUserProfile);
router.put("/profile",updateUserProfile);

//events
router.get('/events/upcoming',getUpcomingEvents);
router.get('/events/register/:eventId',registerForEvent);

//apply for volunteer
router.get('/volunteer/apply',applyForVolunteer);

export default router;