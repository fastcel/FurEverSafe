const express = require("express");
const router = express.Router();

const NotificationController = require("../controllers/notification.controller");
const authMiddleware = require("./auth");

// GET all notifications
router.get(
  "/",
  authMiddleware,
  NotificationController.getNotifications
);

// mark one as read
router.patch(
  "/:id/read",
  authMiddleware,
  NotificationController.markAsRead
);

// mark all as read
router.patch(
  "/read-all",
  authMiddleware,
  NotificationController.markAllAsRead
);

module.exports = router;