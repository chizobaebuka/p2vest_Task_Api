// src/service/tag.service.ts
import TagModel from "../db/models/tagmodel";
import { TagRepository } from "../repository/tag.repository";

export class TagService {
    private tagRepo: TagRepository;

    constructor() {
        this.tagRepo = new TagRepository(); // Initialize TagRepository here
    }

    public async createTag(tagName: string): Promise<TagModel> {
        return this.tagRepo.createTag(tagName); // Call the TagRepository method
    }

    
}
