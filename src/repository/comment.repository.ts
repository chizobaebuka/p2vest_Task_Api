import CommentModel from "../db/models/commentmodel";
import { v4 as uuidv4 } from 'uuid';

export class CommentRepository {
    public async createComment(userId: string, taskId: string, content: string) {
        return CommentModel.create({
            id: uuidv4(),
            content,
            userId,
            taskId,
        });
    }

    public async getCommentById(id: string) {
        return CommentModel.findOne({ where: { id } });
    }

    public async updateComment(id: string, newContent: string) {
        return CommentModel.update({ content: newContent }, { where: { id }, returning: true });
    }

    public async deleteComment(id: string) {
        return CommentModel.destroy({ where: { id } });
    }

    public async getAllComments() {
        return CommentModel.findAll();
    }
}