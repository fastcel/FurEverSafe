const { pool } = require("../db");

const createAuditLog = async ({
  admin_id,
  action,
  target_type,
  target_id,
  description,
}) => {
  try {
    await pool.query(
      `
      INSERT INTO audit_logs 
      (admin_id, action, target_type, target_id, description)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [admin_id, action, target_type, target_id, description]
    );
  } catch (err) {
    console.log("🔥 AUDIT LOG ERROR:", err.message);
    // IMPORTANT: never crash main flow because of logging failure
  }
};

module.exports = {
  createAuditLog,
};