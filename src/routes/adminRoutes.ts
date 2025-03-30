import express from 'express';
import { createEvent, deleteEvent, updateEvent } from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateAdmin);

router.post('/events',createEvent);
router.put('/events/:id',updateEvent);
router.delete('/events/:id',deleteEvent);

router.post('/events/:id/attendance',);
router.get('/reports/attendence');

export default router;