"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/comment.route.ts
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const commentController = new comment_controller_1.CommentController();
// Bind the methods to the controller instance
router.post('/add-comment/:taskId', auth_middleware_1.authenticate, commentController.addComment.bind(commentController));
router.put('/edit-comment/:commentId', auth_middleware_1.authenticate, commentController.editComment.bind(commentController));
router.delete('/delete-comment/:commentId', auth_middleware_1.authenticate, commentController.deleteComment.bind(commentController));
router.get('/all-comments', commentController.getAllComments.bind(commentController));
exports.default = router;
