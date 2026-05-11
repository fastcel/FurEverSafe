const { pool } = require("../db");

const submitApplication = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // =====================================================
    // STEP 0: VALIDATE listing exists (IMPORTANT FIX)
    // =====================================================
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
      [data.listing_id, data.user_id]
    );

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

    return application;

  } catch (err) {
    await client.query("ROLLBACK");
    console.log("🔥 ADOPTION ERROR:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  submitApplication,
};