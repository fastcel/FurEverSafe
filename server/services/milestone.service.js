const { pool } = require("../db");

const getUserMilestones = async (userId) => {
  /* ======================================================
     1. APPROVED ADOPTIONS
  ====================================================== */
  const adoptionResult = await pool.query(
    `
    SELECT COUNT(*)::int AS count
    FROM adoption_applications
    WHERE user_id = $1 AND status = 'approved'
    `,
    [userId]
  );

  const adoptionCount = adoptionResult.rows[0].count;
  const adoptionPoints = adoptionCount * 50;

  /* ======================================================
     2. ABUSE REPORTS
  ====================================================== */
  const abuseResult = await pool.query(
    `
    SELECT COUNT(*)::int AS count
    FROM abuse_reports
    WHERE user_id = $1
    `,
    [userId]
  );

  const abuseCount = abuseResult.rows[0].count;
  const abusePoints = abuseCount * 30;

  /* ======================================================
     3. TOTAL POINTS
  ====================================================== */
  const totalPoints = adoptionPoints + abusePoints;

  /* ======================================================
     4. BADGES
  ====================================================== */
  const badges = {
    bronze: totalPoints >= 100,
    silver: totalPoints >= 250,
    gold: totalPoints >= 400
  };

  let nextBadge = null;
  if (totalPoints < 100) nextBadge = "bronze (100)";
  else if (totalPoints < 250) nextBadge = "silver (250)";
  else if (totalPoints < 400) nextBadge = "gold (400)";
  else nextBadge = "max level reached";

  /* ======================================================
     RETURN FINAL OBJECT
  ====================================================== */
  return {
    userId,
    totalPoints,
    breakdown: {
      adoptions: {
        count: adoptionCount,
        points: adoptionPoints
      },
      abuseReports: {
        count: abuseCount,
        points: abusePoints
      }
    },
    badges,
    nextBadge
  };
};

module.exports = {
  getUserMilestones
};