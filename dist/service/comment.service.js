"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
// src/service/comment.service.ts
const comment_repository_1 = require("../repository/comment.repository");
class CommentService {
    constructor() {
        this.commentRepo = new comment_repository_1.CommentRepository();
    }
    async addComment(userId, taskId, content) {
        return this.commentRepo.createComment(userId, taskId, content);
    }
    async editComment(userId, commentId, newContent) {
        const comment = await this.commentRepo.getCommentById(commentId);
        if (comment && comment.userId === userId) {
            return this.commentRepo.updateComment(commentId, newContent);
        }
        return null;
    }
    async deleteComment(userId, commentId, isAdmin) {
        const comment = await this.commentRepo.getCommentById(commentId);
        if (comment && (comment.userId === userId || isAdmin)) {
            return this.commentRepo.deleteComment(commentId);
        }
        return null;
    }
    async getAllComments() {
        return this.commentRepo.getAllComments();
    }
}
exports.CommentService = CommentService;
