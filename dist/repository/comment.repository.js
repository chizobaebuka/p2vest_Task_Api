"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const commentmodel_1 = __importDefault(require("../db/models/commentmodel"));
const uuid_1 = require("uuid");
class CommentRepository {
    async createComment(userId, taskId, content) {
        return commentmodel_1.default.create({
            id: (0, uuid_1.v4)(),
            content,
            userId,
            taskId,
        });
    }
    async getCommentById(id) {
        return commentmodel_1.default.findOne({ where: { id } });
    }
    async updateComment(id, newContent) {
        return commentmodel_1.default.update({ content: newContent }, { where: { id }, returning: true });
    }
    async deleteComment(id) {
        return commentmodel_1.default.destroy({ where: { id } });
    }
    async getAllComments() {
        return commentmodel_1.default.findAll();
    }
}
exports.CommentRepository = CommentRepository;
