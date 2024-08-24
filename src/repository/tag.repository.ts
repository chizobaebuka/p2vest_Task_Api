// src/repository/tag.repository.ts
import TagModel from "../db/models/tagmodel";
import { v4 as uuidv4 } from "uuid";

export class TagRepository {
    public async createTag(tagName: string): Promise<TagModel> {
        return TagModel.create({ id: uuidv4(), name: tagName });
    }

    public async getTagById(tagId: string): Promise<TagModel | null> {
        return TagModel.findByPk(tagId); 
    }
}
