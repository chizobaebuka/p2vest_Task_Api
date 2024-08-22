"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const tag_repository_1 = require("../repository/tag.repository");
class TagService {
    constructor() {
        this.tagRepo = new tag_repository_1.TagRepository(); // Initialize TagRepository here
    }
    async createTag(tagName) {
        return this.tagRepo.createTag(tagName); // Call the TagRepository method
    }
}
exports.TagService = TagService;
