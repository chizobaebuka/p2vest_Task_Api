// src/service/comment.service.ts
import { CommentRepository } from '../repository/comment.repository';

export class CommentService {
    private commentRepo = new CommentRepository();

    public async addComment(userId: string, taskId: string, content: string) {
        return this.commentRepo.createComment(userId, taskId, content);
    }

    public async editComment(userId: string, commentId: string, newContent: string) {
        const comment = await this.commentRepo.getCommentById(commentId);
        if (comment && comment.userId === userId) {
            return this.commentRepo.updateComment(commentId, newContent);
        }
        return null;
    }

    public async deleteComment(userId: string, commentId: string, isAdmin: boolean) {
        const comment = await this.commentRepo.getCommentById(commentId);
        if (comment && (comment.userId === userId || isAdmin)) {
            return this.commentRepo.deleteComment(commentId);
        }
        return null;
    }

    public async getAllComments() {
        return this.commentRepo.getAllComments();
    }
}
