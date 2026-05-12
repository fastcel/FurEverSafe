const { pool } = require("../db");

const getUserMilestones = async (userId) => {

  /* ── 1. TOTAL POINTS from users table ── */
  const userResult = await pool.query(
    `SELECT reward_points FROM users WHERE user_id = $1`,
    [userId]
  );
  const totalPoints = userResult.rows[0]?.reward_points || 0;

  /* ── 2. BREAKDOWN from reward_transactions ── */
  const txResult = await pool.query(
    `SELECT source_type, SUM(points)::int AS points, COUNT(*)::int AS count
     FROM reward_transactions
     WHERE user_id = $1
     GROUP BY source_type`,
    [userId]
  );

  let adoptionPoints = 0, adoptionCount = 0;
  let abusePoints = 0, abuseCount = 0;

  txResult.rows.forEach(row => {
    if (row.source_type === 'adoption') {
      adoptionPoints = row.points;
      adoptionCount = row.count;
    }
    if (row.source_type === 'abuse_report') {
      abusePoints = row.points;
      abuseCount = row.count;
    }
  });

  /* ── 3. BADGES ── */
  const badges = {
    bronze: totalPoints >= 100,
    silver: totalPoints >= 250,
    gold:   totalPoints >= 400,
  };

  let nextBadge = null;
  if      (totalPoints < 100) nextBadge = "bronze (100)";
  else if (totalPoints < 250) nextBadge = "silver (250)";
  else if (totalPoints < 400) nextBadge = "gold (400)";
  else                         nextBadge = "max level reached";

  return {
    userId,
    totalPoints,
    breakdown: {
      adoptions:    { count: adoptionCount,  points: adoptionPoints },
      abuseReports: { count: abuseCount,     points: abusePoints   },
    },
    badges,
    nextBadge,
  };
};

module.exports = { getUserMilestones };