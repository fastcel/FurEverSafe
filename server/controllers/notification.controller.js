const NotificationService = require("../services/notification.service");

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const userId = req.user.id;

      const notifications =
        await NotificationService.getUserNotifications(userId);

      res.json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  }

  static async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;

      await NotificationService.markAsRead(notificationId, userId);

      res.json({ message: "Marked as read" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating notification" });
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      await NotificationService.markAllAsRead(userId);

      res.json({ message: "All notifications marked as read" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating notifications" });
    }
  }
}

module.exports = NotificationController;