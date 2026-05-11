const { pool } = require("../db");
const auditService = require("./audit.service");

const submitApplication = async (data, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // =====================================================
    // STEP 0: VALIDATE listing exists (IMPORTANT FIX)
    // =====================================================
    if (!data.listing_id) {
      throw new Error("listing_id required");
    }
    const listingCheck = await client.query(
      `SELECT listing_id FROM adoption_listings WHERE listing_id = $1`,
      [data.listing_id]
    );

    if (listingCheck.rows.length === 0) {
      throw new Error("Invalid listing_id (does not exist)");
    }

    // =====================================================
    // STEP 1: Create application
    // =====================================================
    const applicationResult = await client.query(
      `
      INSERT INTO adoption_applications
      (listing_id, user_id, status)
      VALUES ($1, $2, 'pending')
      RETURNING *
      `,
      [data.listing_id, userId]
    );

    await auditService.createAuditLog({
      admin_id: userId,
      action: "ADOPTION_APPLY",
      target_type: "adoption_application",
      target_id: application.application_id,
      description: `User ${userId} applied for listing ${data.listing_id}`,
    });

    const application = applicationResult.rows[0];

    // =====================================================
    // STEP 2: Create profile
    // =====================================================
    await client.query(
      `
      INSERT INTO adoption_application_profiles
      (
        application_id,
        full_name,
        preferred_contact_method,
        house_type,
        monthly_income_range,
        monthly_budget_range,
        pet_alone_hours,
        has_children,
        motivation,
        contact_number,
        email,
        other_pets
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      `,
      [
        application.application_id,
        data.full_name,
        data.preferred_contact_method,
        data.house_type,
        data.monthly_income_range,
        data.monthly_budget_range,
        data.pet_alone_hours,
        data.has_children,
        data.motivation,
        data.contact_number,
        data.email,
        data.other_pets
      ]
    );

    await client.query("COMMIT");

    await auditService.createAuditLog({
      admin_id: userId,
      action: "ADOPTION_PROFILE_CREATED",
      target_type: "adoption_profile",
      target_id: application.application_id,
      description: `Profile created for application ${application.application_id}`,
    });

    return application;

  } catch (err) {
    await client.query("ROLLBACK");
    console.log("🔥 ADOPTION ERROR:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

const getUserApplications = async (user_id, tab) => {
  let query = `
    SELECT 
      a.application_id,
      a.status,
      a.created_at,

      l.listing_id,

      p.pet_id,
      p.name AS pet_name,
      p.breed,
      p.age,
      p.city,
      p.gender,

      pt.name AS pet_type

    FROM adoption_applications a
    JOIN adoption_listings l ON l.listing_id = a.listing_id
    JOIN pets p ON p.pet_id = l.pet_id
    LEFT JOIN pet_types pt ON pt.pet_type_id = p.pet_type_id

    WHERE a.user_id = $1
  `;

  const values = [user_id];

  // 🔵 ongoing tab
  if (tab === "ongoing") {
    query += ` AND a.status = 'pending'`;
  }

  // 🟡 previous tab
  else if (tab === "previous") {
    query += ` AND a.status IN ('approved', 'rejected', 'cancelled')`;
  }

  query += ` ORDER BY a.created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};


module.exports = {
  submitApplication,
  getUserApplications,
};