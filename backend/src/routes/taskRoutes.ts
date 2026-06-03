import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask, addComment } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:taskId/comments', addComment);

export default router;
