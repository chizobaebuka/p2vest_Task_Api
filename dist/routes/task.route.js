"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const task_service_1 = require("../service/task.service");
const task_repository_1 = require("../repository/task.repository");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const taskRepo = new task_repository_1.TaskRepository();
const taskService = new task_service_1.TaskService();
const taskController = new task_controller_1.TaskController(taskService);
/**
   * @swagger
   * tags:
   *   name: Tasks
   *   description: API endpoints to manage task
*/
router.post('/tasks', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), taskController.createTask.bind(taskController));
router.put('/:taskId/assign/:assignedToId', auth_middleware_1.authenticate, taskController.assignTask.bind(taskController));
router.put('/:taskId/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), taskController.updateTaskStatus.bind(taskController));
router.post('/:taskId/add-tags', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Regular']), taskController.addTagsToTask.bind(taskController));
router.get('/all-tasks', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin']), taskController.getAllTasks.bind(taskController));
router.get('/filtered-tasks', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), taskController.getAllTasksWithFilters.bind(taskController));
router.delete('/:taskId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), taskController.deleteTask.bind(taskController));
router.get('/get-task/:taskId', auth_middleware_1.authenticate, taskController.getTaskById.bind(taskController));
exports.default = router;
