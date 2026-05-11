const express = require("express");
const router = express.Router();

const NotificationController = require("../controllers/notification.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// GET all notifications
router.get(
  "/",
  authenticate,
  NotificationController.getNotifications
);

// mark one as read
router.patch(
  "/:id/read",
  authenticate,
  NotificationController.markAsRead
);

// mark all as read
router.patch(
  "/read-all",
  authenticate,
  NotificationController.markAllAsRead
);

module.exports = router;