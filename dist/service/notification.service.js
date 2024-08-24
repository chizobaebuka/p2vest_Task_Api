"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const uuid_1 = require("uuid");
const notification_1 = __importDefault(require("../db/models/notification"));
class NotificationService {
    static createNotification(userId, taskId, type, message) {
        return notification_1.default.create({ id: (0, uuid_1.v4)(), userId, taskId, type, message, isRead: false });
    }
    async getNotifications(userId) {
        return notification_1.default.findAll({ where: { userId }, include: ['user', 'task'] });
    }
    async markAsRead(notificationId) {
        return notification_1.default.update({ isRead: true }, { where: { id: notificationId } });
    }
}
exports.NotificationService = NotificationService;
