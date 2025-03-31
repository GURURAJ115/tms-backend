import express from 'express';
import { createEvent, deleteEvent, generateAttendanceReport, markAttendance, updateEvent } from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateAdmin);

router.post('/events',createEvent);
router.put('/events/:id',updateEvent);
router.delete('/events/:id',deleteEvent);

router.post('/events/:id/attendance',markAttendance);
router.get('/reports/attendence',generateAttendanceReport);

export default router;