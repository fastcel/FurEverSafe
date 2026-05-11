const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const updateProfile = async (userId, data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // get current user
    const userResult = await client.query(
      `
      SELECT password_hash
      FROM users
      WHERE user_id = $1
      `,
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      throw new Error("User not found");
    }

    let passwordHash = null;

    // PASSWORD CHANGE LOGIC
    if (
      data.oldPassword ||
      data.newPassword ||
      data.confirmPassword
    ) {

      // ensure all fields provided
      if (
        !data.oldPassword ||
        !data.newPassword ||
        !data.confirmPassword
      ) {
        throw new Error("All password fields are required");
      }

      // check old password
      const isMatch = await bcrypt.compare(
        data.oldPassword,
        user.password_hash
      );

      if (!isMatch) {
        throw new Error("Old password is incorrect");
      }

      // check new passwords match
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      // hash new password
      passwordHash = await bcrypt.hash(data.newPassword, 10);
    }

    const result = await client.query(
      `
      UPDATE users
      SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        contact_number = COALESCE($3, contact_number),
        password_hash = COALESCE($4, password_hash),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5
      RETURNING user_id, name, email, contact_number, role
      `,
      [
        data.name,
        data.email,
        data.contact_number,
        passwordHash,
        userId,
      ]
    );

    await client.query("COMMIT");

    return result.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getProfile = async (userId) => {
  const result = await pool.query(
    `SELECT user_id, name, email, contact_number, role
     FROM users WHERE user_id = $1`,
    [userId]
  );
  if (!result.rows[0]) throw new Error("User not found");
  return result.rows[0];
};

module.exports = {
  updateProfile,
  getProfile
};