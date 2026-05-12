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

      if (data.newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // check email uniqueness
      if (data.email) {
        const emailCheck = await client.query(
          `
          SELECT user_id
          FROM users
          WHERE email = $1
          AND user_id != $2
          `,
          [data.email, userId]
        );

        if (emailCheck.rows.length > 0) {
          throw new Error("Email already in use");
        }
      }

      // check contact uniqueness
      if (data.contact_number) {
        const phoneCheck = await client.query(
          `
          SELECT user_id
          FROM users
          WHERE contact_number = $1
          AND user_id != $2
          `,
          [data.contact_number, userId]
        );

        if (phoneCheck.rows.length > 0) {
          throw new Error("Phone number already in use");
        }
      }

      // check username uniqueness
      if (data.name) {
        const nameCheck = await client.query(
          `
          SELECT user_id
          FROM users
          WHERE name = $1
          AND user_id != $2
          `,
          [data.name, userId]
        );

        if (nameCheck.rows.length > 0) {
          throw new Error("Username already in use");
        }
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

const deleteProfile = async (userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // optional: soft delete safer in real apps
    await client.query(
      `
      UPDATE users
      SET is_active = false
      WHERE user_id = $1
      `,
      [userId]
    );

    await client.query("COMMIT");

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  updateProfile,
  getProfile,
  deleteProfile
};