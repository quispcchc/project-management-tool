import { Router } from 'express';
import { 
  getProjects, getProjectById, createProject, updateProject, deleteProject, 
  addProjectMember, removeProjectMember 
} from '../controllers/projectController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authorize(['SUPER_ADMIN', 'MANAGER']), createProject);
router.put('/:id', authorize(['SUPER_ADMIN', 'MANAGER']), updateProject);
router.delete('/:id', authorize(['SUPER_ADMIN', 'MANAGER']), deleteProject);

router.post('/:projectId/members', authorize(['SUPER_ADMIN', 'MANAGER']), addProjectMember);
router.delete('/:projectId/members/:memberId', authorize(['SUPER_ADMIN', 'MANAGER']), removeProjectMember);

export default router;
