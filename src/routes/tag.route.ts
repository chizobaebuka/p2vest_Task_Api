import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { TagController } from '../controllers/tag.controller';

const router = express.Router();
const commentController = new TagController();

/**
   * @swagger
   * tags:
   *   name: Tags
   *   description: API endpoints to manage comments
*/
router.post('/add-tag', authenticate, commentController.createTag.bind(commentController));

export default router;

