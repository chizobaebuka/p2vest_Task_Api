"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const task_service_1 = require("../service/task.service");
const task_repository_1 = require("../repository/task.repository");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const taskRepo = new task_repository_1.TaskRepository();
const taskService = new task_service_1.TaskService(taskRepo);
const taskController = new task_controller_1.TaskController(taskService);
router.post('/tasks', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), (0, auth_middleware_1.asyncMiddleware)((req, res) => taskController.createTask(req, res)));
router.put('/:taskId/assign/:assignedToId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin']), // Assuming only Admins can assign tasks to others
(req, res) => taskController.assignTask(req, res));
router.put('/:taskId/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), // Both Admin and Regular users need to be authorized
(req, res) => taskController.updateTaskStatus(req, res));
exports.default = router;
