import { Request, Response } from 'express';
import { RequestExt } from '../middleware/auth.middleware';
import { TagService } from '../service/tag.service';
import { addTagSchema } from '../utils/validation';

export class TagController {
    private tagService = new TagService();

    public async createTag(req: RequestExt, res: Response): Promise<Response> {
        const userRole = req.user?.role;  
        const { name } = req.body;

        // Validate request body
        const { success, error } = addTagSchema.safeParse({ name });
        if (!success) {
            return res.status(400).json({ error: 'Invalid request body', details: error.errors });
        }

        // Check if the user is an admin
        if (userRole !== 'Admin') {
            return res.status(403).json({ error: 'Forbidden: Only admins can create tags' });
        }

        try {
            const tag = await this.tagService.createTag(name);
            return res.status(201).json({ message: 'Tag added successfully', tag });
        } catch (error) {
            console.error('Error adding tag:', error);
            return res.status(500).json({ error: 'Error adding tag' });
        }
    }
}
