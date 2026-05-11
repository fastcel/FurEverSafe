const { pool } = require("../db");
const { createNotification } = require("./notification.service");
const { addReward } = require("./reward.service");

/* ======================================================
   SUBMIT APPLICATION
====================================================== */
const submitApplication = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // STEP 0: validate listing
    const listingCheck = await client.query(
      `SELECT listing_id FROM adoption_listings WHERE listing_id = $1`,
      [data.listing_id]
    );

    if (listingCheck.rows.length === 0) {
      throw new Error("Invalid listing_id (does not exist)");
    }

    // STEP 1: create application
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

    // STEP 2: create profile
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

    // 🔥 NOTIFICATION (AFTER COMMIT)
    await createNotification({
      user_id: data.user_id,
      type: "adoption",
      message: `Your adoption application has been submitted`,
      source_type: "adoption_application",
      source_id: application.application_id
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

/* ======================================================
   GET USER APPLICATIONS
====================================================== */
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

  if (tab === "ongoing") {
    query += ` AND a.status = 'pending'`;
  } else if (tab === "previous") {
    query += ` AND a.status IN ('approved', 'rejected', 'cancelled')`;
  }

  query += ` ORDER BY a.created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

/* ======================================================
   UPDATE ADOPTION STATUS (NGO)
====================================================== */

const updateAdoptionStatus = async (application_id, status) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ======================================================
       1. VALIDATE STATUS
    ====================================================== */
    const allowedStatuses = ["approved", "rejected", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status value");
    }

    /* ======================================================
       2. UPDATE APPLICATION
    ====================================================== */
    const result = await client.query(
      `
      UPDATE adoption_applications
      SET status = $1
      WHERE application_id = $2
      RETURNING user_id, listing_id
      `,
      [status, application_id]
    );

    if (!result.rows.length) {
      throw new Error("Invalid application_id");
    }

    const data = result.rows[0];

    /* ======================================================
       3. GET PET NAME
    ====================================================== */
    const petResult = await client.query(
      `
      SELECT p.name
      FROM adoption_listings l
      JOIN pets p ON p.pet_id = l.pet_id
      WHERE l.listing_id = $1
      `,
      [data.listing_id]
    );

    if (!petResult.rows.length) {
      throw new Error("Pet not found for listing");
    }

    const petName = petResult.rows[0].name;

    /* ======================================================
       4. BUILD MESSAGE
    ====================================================== */
    let message = "";

    if (status === "approved") {
      message = `🎉 Your adoption application for ${petName} has been approved`;
    } else if (status === "rejected") {
      message = `❌ Your adoption application for ${petName} has been rejected`;
    } else if (status === "cancelled") {
      message = `⚠️ Your adoption application for ${petName} was cancelled`;
    }

    /* ======================================================
       5. COMMIT DB CHANGES
    ====================================================== */
    await client.query("COMMIT");

    /* ======================================================
       6. SIDE EFFECTS (SAFE AFTER COMMIT)
    ====================================================== */
    try {
      if (status === "approved") {
        await addReward({
          user_id: data.user_id,
          points: 50,
          source_type: "adoption",
          source_id: application_id
        });
      }
    } catch (err) {
      console.log("🔥 Reward failed (non-blocking):", err.message);
    }

    try {
      await createNotification({
        user_id: data.user_id,
        type: "adoption",
        message,
        source_type: "adoption_application",
        source_id: application_id
      });
    } catch (err) {
      console.log("🔥 Notification failed (non-blocking):", err.message);
    }

    /* ======================================================
       7. RETURN RESULT
    ====================================================== */
    return result.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  submitApplication,
  getUserApplications,
  updateAdoptionStatus
};