import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../service/task.service';
import { TaskRepository } from '../repository/task.repository';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const taskRepo = new TaskRepository();
const taskService = new TaskService();
const taskController = new TaskController(taskService);

/**
   * @swagger
   * tags:
   *   name: Tasks
   *   description: API endpoints to manage task
*/
router.post('/tasks', authenticate, authorize(['Admin', 'Regular']), taskController.createTask.bind(taskController))
router.put('/:taskId/assign/:assignedToId', authenticate, taskController.assignTask.bind(taskController));
router.put('/:taskId/status', authenticate, authorize(['Admin', 'Regular']), taskController.updateTaskStatus.bind(taskController))
router.post('/:taskId/add-tags', authenticate, authorize(['Regular']), taskController.addTagsToTask.bind(taskController));
router.get('/all-tasks', authenticate, authorize(['Admin']), taskController.getAllTasks.bind(taskController));
router.get('/filtered-tasks', authenticate, authorize(['Admin', 'Regular']), taskController.getAllTasksWithFilters.bind(taskController));
router.delete('/:taskId', authenticate, authorize(['Admin', 'Regular']), taskController.deleteTask.bind(taskController));
router.get('/get-task/:taskId', authenticate, taskController.getTaskById.bind(taskController));

export default router;
