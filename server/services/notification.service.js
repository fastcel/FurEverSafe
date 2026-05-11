const { pool } = require("../db");

/* ======================================================
   CREATE NOTIFICATION
====================================================== */
const createNotification = async ({
  user_id,
  type,
  message,
  source_type,
  source_id
}) => {
  await pool.query(
    `
    INSERT INTO notifications
    (user_id, type, message, source_type, source_id)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [user_id, type, message, source_type, source_id]
  );
};

/* ======================================================
   GET USER NOTIFICATIONS
====================================================== */
const getUserNotifications = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

/* ======================================================
   MARK ONE AS READ
====================================================== */
const markAsRead = async (notificationId, userId) => {
  await pool.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE notification_id = $1 AND user_id = $2
    `,
    [notificationId, userId]
  );
};

/* ======================================================
   MARK ALL AS READ
====================================================== */
const markAllAsRead = async (userId) => {
  await pool.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE user_id = $1
    `,
    [userId]
  );
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead
};