import { v4 as uuidv4 } from "uuid";
import NotificationModel from "../db/models/notification";

export class NotificationService {
    static createNotification(userId: any, taskId: string, type: string, message: string) {
        return NotificationModel.create({ id: uuidv4(), userId, taskId, type, message, isRead: false });
    }

    public async getNotifications(userId: string) {
        return NotificationModel.findAll({ where: { userId }, include: ['user', 'task'] });
    }

    public async markAsRead(notificationId: string) {
        return NotificationModel.update({ isRead: true }, { where: { id: notificationId } });
    }
}



