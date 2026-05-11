const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const updateProfile = async (userId, data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let passwordHash = null;

    // hash password if provided
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 10);
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

module.exports = {
  updateProfile,
};