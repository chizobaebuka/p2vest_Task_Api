import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../service/task.service';
import { TaskRepository } from '../repository/task.repository';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const taskRepo = new TaskRepository();
const taskService = new TaskService();
const taskController = new TaskController(taskService);

// router.post(
//     '/tasks',
//     authenticate,
//     authorize(['Admin', 'Regular']),
//     asyncMiddleware((req, res) => taskController.createTask(req, res))
// );
router.post('/tasks', authenticate, authorize(['Admin', 'Regular']), taskController.createTask.bind(taskController))

// router.put(
//     '/:taskId/assign/:assignedToId',
//     authenticate,
//     authorize(['Admin']), // Assuming only Admins can assign tasks to others
//     (req, res) => taskController.assignTask(req, res)
// );

router.put('/:taskId/assign/:assignedToId', authenticate, authorize([ 'Admin' ]), taskController.assignTask.bind(taskController));

// router.put(
//     '/:taskId/status',
//     authenticate,
//     authorize(['Admin', 'Regular']), // Both Admin and Regular users need to be authorized
//     (req, res) => taskController.updateTaskStatus(req, res)
// );

router.put('/:taskId/status', authenticate, authorize(['Admin', 'Regular']), taskController.updateTaskStatus.bind(taskController))

// router.post(
//     '/:taskId/tags',
//     authenticate,
//     authorize(['Regular']),
//     taskController.addTagsToTask.bind(taskController)
// );

router.post('/:taskId/tags', authenticate, authorize(['Regular']), taskController.addTagsToTask.bind(taskController));

router.get('/all-tasks', authenticate, authorize(['Admin']), (req, res) => taskController.getAllTasks(req, res));
router.get('/filtered-tasks', authenticate, authorize(['Admin', 'Regular']), (req, res) => taskController.getAllTasksWithFilters(req, res));

export default router;
