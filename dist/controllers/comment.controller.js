"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const comment_service_1 = require("../service/comment.service");
const validation_1 = require("../utils/validation");
class CommentController {
    constructor() {
        this.commentService = new comment_service_1.CommentService();
    }
    async addComment(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { taskId } = req.params;
            const { content } = req.body;
            // Validate request param
            const paramsValidation = validation_1.taskIdParamSchema.safeParse({ taskId });
            if (!paramsValidation.success) {
                return res.status(400).json({ error: 'Invalid task ID', details: paramsValidation.error.errors });
            }
            // Validate request body
            const bodyValidation = validation_1.addCommentSchema.safeParse({ content });
            if (!bodyValidation.success) {
                return res.status(400).json({ error: 'Invalid request body', details: bodyValidation.error.errors });
            }
            const comment = await this.commentService.addComment(userId, taskId, content);
            return res.status(201).json({ message: 'Comment added successfully', comment });
        }
        catch (error) {
            return res.status(500).json({ error: 'Error adding comment' });
        }
    }
    async editComment(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { commentId } = req.params;
            const { content } = req.body;
            const updatedComment = await this.commentService.editComment(userId, commentId, content);
            if (updatedComment) {
                return res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
            }
            return res.status(404).json({ error: 'Comment not found or not authorized' });
        }
        catch (error) {
            return res.status(500).json({ error: 'Error updating comment' });
        }
    }
    async deleteComment(req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { commentId } = req.params;
            const isAdmin = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'Admin';
            const deletedComment = await this.commentService.deleteComment(userId, commentId, isAdmin);
            if (deletedComment) {
                return res.status(200).json({ message: 'Comment deleted successfully' });
            }
            return res.status(404).json({ error: 'Comment not found or not authorized' });
        }
        catch (error) {
            return res.status(500).json({ error: 'Error deleting comment' });
        }
    }
    async getAllComments(req, res) {
        try {
            const comments = await this.commentService.getAllComments();
            return res.status(200).json({
                message: 'All Comments fetched successfully',
                comments,
            });
        }
        catch (error) {
            return res.status(500).json({ error: 'Error fetching comments' });
        }
    }
}
exports.CommentController = CommentController;
