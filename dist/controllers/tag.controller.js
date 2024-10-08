"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const tag_service_1 = require("../service/tag.service");
const validation_1 = require("../utils/validation");
class TagController {
    constructor() {
        this.tagService = new tag_service_1.TagService();
    }
    async createTag(req, res) {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const { name } = req.body;
        // Validate request body
        const { success, error } = validation_1.addTagSchema.safeParse({ name });
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
        }
        catch (error) {
            console.error('Error adding tag:', error);
            return res.status(500).json({ error: 'Error adding tag' });
        }
    }
}
exports.TagController = TagController;
