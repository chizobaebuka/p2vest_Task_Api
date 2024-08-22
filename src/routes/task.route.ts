import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../service/task.service';
import { TaskRepository } from '../repository/task.repository';
import { asyncMiddleware, authenticate, authorize } from '../middleware/auth.middleware';
import { TagRepository } from '../repository/tag.repository';

const router = Router();
const taskRepo = new TaskRepository();
const taskService = new TaskService();
const taskController = new TaskController(taskService);

router.post(
    '/tasks',
    authenticate,
    authorize(['Admin', 'Regular']),
    asyncMiddleware((req, res) => taskController.createTask(req, res))
);

router.put(
    '/:taskId/assign/:assignedToId',
    authenticate,
    authorize(['Admin']), // Assuming only Admins can assign tasks to others
    (req, res) => taskController.assignTask(req, res)
);

router.put(
    '/:taskId/status',
    authenticate,
    authorize(['Admin', 'Regular']), // Both Admin and Regular users need to be authorized
    (req, res) => taskController.updateTaskStatus(req, res)
);

// router.post('/:taskId/tags', authenticate, authorize([ 'Regular' ]), (req, res) => taskController.addTagsToTask(req, res));
router.post(
    '/:taskId/tags',
    authenticate,
    authorize(['Regular']),
    taskController.addTagsToTask.bind(taskController)
);

export default router;
