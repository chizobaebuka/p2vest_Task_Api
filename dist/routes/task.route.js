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
// router.post(
//     '/tasks',
//     authenticate,
//     authorize(['Admin', 'Regular']),
//     asyncMiddleware((req, res) => taskController.createTask(req, res))
// );
router.post('/tasks', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), taskController.createTask.bind(taskController));
// router.put(
//     '/:taskId/assign/:assignedToId',
//     authenticate,
//     authorize(['Admin']), // Assuming only Admins can assign tasks to others
//     (req, res) => taskController.assignTask(req, res)
// );
router.put('/:taskId/assign/:assignedToId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin']), taskController.assignTask.bind(taskController));
// router.put(
//     '/:taskId/status',
//     authenticate,
//     authorize(['Admin', 'Regular']), // Both Admin and Regular users need to be authorized
//     (req, res) => taskController.updateTaskStatus(req, res)
// );
router.put('/:taskId/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), taskController.updateTaskStatus.bind(taskController));
// router.post(
//     '/:taskId/tags',
//     authenticate,
//     authorize(['Regular']),
//     taskController.addTagsToTask.bind(taskController)
// );
router.post('/:taskId/tags', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Regular']), taskController.addTagsToTask.bind(taskController));
router.get('/all-tasks', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin']), (req, res) => taskController.getAllTasks(req, res));
router.get('/filtered-tasks', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), (req, res) => taskController.getAllTasksWithFilters(req, res));
exports.default = router;
