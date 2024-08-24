"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const tag_controller_1 = require("../controllers/tag.controller");
const router = express_1.default.Router();
const commentController = new tag_controller_1.TagController();
/**
   * @swagger
   * tags:
   *   name: Tags
   *   description: API endpoints to manage comments
*/
router.post('/add-tag', auth_middleware_1.authenticate, commentController.createTag.bind(commentController));
exports.default = router;
