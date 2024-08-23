// src/controllers/comment.controller.ts
import { Request, Response } from 'express';
import { RequestExt } from '../middleware/auth.middleware';
import { CommentService } from '../service/comment.service';
import { addCommentSchema, taskIdParamSchema } from '../utils/validation';

export class CommentController {
    private commentService = new CommentService();

    public async addComment(req: RequestExt, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id as string;
            const { taskId } = req.params;
            const { content } = req.body;

            // Validate request param
            const paramsValidation = taskIdParamSchema.safeParse({ taskId });
            if (!paramsValidation.success) {
                return res.status(400).json({ error: 'Invalid task ID', details: paramsValidation.error.errors });
            }

            // Validate request body
            const bodyValidation = addCommentSchema.safeParse({ content });
            if (!bodyValidation.success) {
                return res.status(400).json({ error: 'Invalid request body', details: bodyValidation.error.errors });
            }

            const comment = await this.commentService.addComment(userId, taskId, content);
            return res.status(201).json({ message: 'Comment added successfully', comment });
        } catch (error) {
            return res.status(500).json({ error: 'Error adding comment' });
        }
    }

    public async editComment(req: RequestExt, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id as string;
            const { commentId } = req.params;
            const { content } = req.body;

            const updatedComment = await this.commentService.editComment(userId, commentId, content);
            if (updatedComment) {
                return res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
            }
            return res.status(404).json({ error: 'Comment not found or not authorized' });
        } catch (error) {
            return res.status(500).json({ error: 'Error updating comment' });
        }
    }

    public async deleteComment(req: RequestExt, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id as string;
            const { commentId } = req.params;
            const isAdmin = req.user?.role === 'Admin';

            const deletedComment = await this.commentService.deleteComment(userId, commentId, isAdmin);
            if (deletedComment) {
                return res.status(200).json({ message: 'Comment deleted successfully' });
            }
            return res.status(404).json({ error: 'Comment not found or not authorized' });
        } catch (error) {
            return res.status(500).json({ error: 'Error deleting comment' });
        }
    }

    public async getAllComments(req: Request, res: Response): Promise<Response> {
        try {
            const comments = await this.commentService.getAllComments();
            return res.status(200).json({
                message: 'All Comments fetched successfully',
                comments,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching comments' });
        }
    }
}
