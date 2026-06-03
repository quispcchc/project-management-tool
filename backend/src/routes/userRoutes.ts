import { Router } from 'express';
import { getUsers, getActivityLogs, getDashboardStats } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getUsers);
router.get('/activity', getActivityLogs);
router.get('/stats', getDashboardStats);

export default router;
