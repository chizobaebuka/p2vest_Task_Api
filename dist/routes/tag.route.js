"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/tag.route.ts
const express_1 = require("express");
const tag_controller_1 = require("../controllers/tag.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const tagRouter = (0, express_1.Router)();
const tagController = new tag_controller_1.TagController();
tagRouter.post('/create-tags', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin', 'Regular']), (req, res) => tagController.createTag(req, res));
exports.default = tagRouter;
