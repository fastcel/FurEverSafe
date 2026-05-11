const { pool } = require("../db");

const auditService = require("./audit.service");

const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT user_id, name, email, contact_number, role, reward_points, created_at, updated_at
    FROM users
    WHERE is_active = true
    ORDER BY created_at DESC
  `);

  return result.rows;
};

const updateUserPatch = async (userId, data, adminId) => {
  // 1. Get existing user
  const existingResult = await pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [userId]
  );

  if (existingResult.rows.length === 0) {
    throw new Error("User not found");
  }

  const existing = existingResult.rows[0];

  // 2. Merge fields (PATCH behavior)
  const updatedData = {
    name: data.name ?? existing.name,
    email: data.email ?? existing.email,
    contact_number: data.contact_number ?? existing.contact_number,
    role: data.role ?? existing.role,
  };

  // 3. Email uniqueness check (only if email changed)
  if (updatedData.email !== existing.email) {
    const emailCheck = await pool.query(
      "SELECT user_id FROM users WHERE email = $1 AND user_id != $2",
      [updatedData.email, userId]
    );

    if (emailCheck.rows.length > 0) {
      throw new Error("Email already in use");
    }
  }

  // 4. Role validation (extra safety)
  const allowedRoles = ["citizen", "ngo", "admin"];

  if (!allowedRoles.includes(updatedData.role)) {
    throw new Error("Invalid role");
  }

  // 5. Update query
  const result = await pool.query(
    `
    UPDATE users
    SET 
      name = $1,
      email = $2,
      contact_number = $3,
      role = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $5
    RETURNING user_id, name, email, contact_number, role, reward_points, created_at, updated_at
    `,
    [
      updatedData.name,
      updatedData.email,
      updatedData.contact_number,
      updatedData.role,
      userId,
    ]
  );

    await auditService.createAuditLog({
    adminId,
    action: "USER_UPDATE",
    target_type: "user",
    target_id: userId,
    description: `User ${userId} updated`,
    });

  return result.rows[0];
};

const deleteUser = async (userId, adminId) => {
  const result = await pool.query(
    `
    UPDATE users
    SET is_active = false,
        deleted_at = CURRENT_TIMESTAMP
    WHERE user_id = $1
    RETURNING user_id, name, email, role, is_active, deleted_at
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
    await auditService.createAuditLog({
    admin_id: adminId,
    action: "USER_DELETE",
    target_type: "user",
    target_id: userId,
    description: `User ${userId} deactivated`,
    });
  return result.rows[0];
};

const getAuditLogs = async () => {
  const result = await pool.query(`
    SELECT 
      a.log_id,
      a.action,
      a.target_type,
      a.target_id,
      a.description,
      a.created_at,
      u.user_id AS admin_id,
      u.name AS admin_name,
      u.email AS admin_email
    FROM audit_logs a
    LEFT JOIN users u ON a.admin_id = u.user_id
    ORDER BY a.created_at DESC
  `);

  return result.rows;
};

module.exports = {
  getAllUsers,
  updateUserPatch,
  deleteUser,
  getAuditLogs,
};