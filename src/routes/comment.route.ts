// src/routes/comment.route.ts
import express from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const commentController = new CommentController();

/**
   * @swagger
   * /api/comment
   * tags:
   *   name: Comments
   *   description: API endpoints to manage comments
*/

// Bind the methods to the controller instance
router.post('/add-comment/:taskId', authenticate, commentController.addComment.bind(commentController));
router.put('/edit-comment/:commentId', authenticate, commentController.editComment.bind(commentController));
router.delete('/delete-comment/:commentId', authenticate, commentController.deleteComment.bind(commentController));
router.get('/all-comments', commentController.getAllComments.bind(commentController));


export default router;
