import express from 'express';

const router = express.Router();

router.post('/admins',);
router.get('/admins');

router.post('/events',);
router.put('/events/:id');
router.delete('/events/:id');

router.post('/events/:id/attendance');
router.get('/reports/attendence');

export default router;