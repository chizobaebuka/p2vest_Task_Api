"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRepository = void 0;
// src/repository/tag.repository.ts
const tagmodel_1 = __importDefault(require("../db/models/tagmodel"));
const uuid_1 = require("uuid");
class TagRepository {
    async createTag(tagName) {
        return tagmodel_1.default.create({ id: (0, uuid_1.v4)(), name: tagName });
    }
    async getTagById(tagId) {
        return tagmodel_1.default.findByPk(tagId);
    }
}
exports.TagRepository = TagRepository;
