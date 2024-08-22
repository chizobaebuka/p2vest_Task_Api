"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const tag_service_1 = require("../service/tag.service");
const validation_1 = require("../utils/validation");
const zod_1 = require("zod");
class TagController {
    constructor() {
        this.tagService = new tag_service_1.TagService(); // Initialize TagService here
    }
    async createTag(req, res) {
        var _a;
        try {
            const tagData = validation_1.createTagSchema.parse(req.body);
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(400).json({ error: 'User not authenticated' });
            }
            const newTag = await this.tagService.createTag(tagData.name);
            return res.status(201).json({ message: 'Tag created successfully', tag: newTag });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            }
            return res.status(400).json({ error: 'Error creating tag: ' + error.message });
        }
    }
}
exports.TagController = TagController;
