const { pool } = require("../db");

const addReward = async ({
  user_id,
  reward_type,
  points,
  source_type,
  source_id
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ======================================================
       1. INSERT INTO TRANSACTIONS
    ====================================================== */
    await client.query(
      `
      INSERT INTO reward_transactions
      (user_id, reward_type_id, points, source_type, source_id)
      VALUES (
        $1,
        (SELECT reward_type_id FROM reward_types WHERE name = $2),
        $3,
        $4,
        $5
      )
      `,
      [user_id, reward_type, points, source_type, source_id]
    );

    /* ======================================================
       2. UPDATE USER TOTAL POINTS
    ====================================================== */
    await client.query(
      `
      UPDATE users
      SET reward_points = COALESCE(reward_points, 0) + $1
      WHERE user_id = $2
      `,
      [points, user_id]
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
  addReward
};