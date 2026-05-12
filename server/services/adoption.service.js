const { pool } = require("../db");
const { createNotification } = require("./notification.service");
const { addReward } = require("./reward.service");
const auditService = require("./audit.service");

/* ======================================================
   SUBMIT APPLICATION
====================================================== */
const submitApplication = async (data, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (!data.listing_id) throw new Error("listing_id required");

    const listingCheck = await client.query(
      `SELECT listing_id FROM adoption_listings WHERE listing_id = $1`,
      [data.listing_id]
    );

    if (listingCheck.rows.length === 0)
      throw new Error("Invalid listing_id (does not exist)");

    const applicationResult = await client.query(
      `INSERT INTO adoption_applications (listing_id, user_id, status)
       VALUES ($1, $2, 'pending') RETURNING *`,
      [data.listing_id, userId]
    );

    const application = applicationResult.rows[0];

    await client.query(
      `INSERT INTO adoption_application_profiles
       (application_id, full_name, preferred_contact_method, house_type,
        monthly_income_range, monthly_budget_range, pet_alone_hours,
        has_children, motivation, contact_number, email, other_pets)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
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

    await createNotification({
      user_id: userId,
      type: "adoption",
      message: `Your adoption application has been submitted`,
      source_type: "adoption_application",
      source_id: application.application_id
    });

    const ngoResult = await pool.query(
      `SELECT n.user_id 
       FROM adoption_listings al
       JOIN ngos n ON n.ngo_id = al.ngo_id
       WHERE al.listing_id = $1`,
      [data.listing_id]
    );

    if (ngoResult.rows.length) {
      await createNotification({
        user_id: ngoResult.rows[0].user_id,
        type: "adoption",
        message: `📋 A new adoption application has been submitted for your listing`,
        source_type: "adoption_application",
        source_id: application.application_id
      });
    }

    await auditService.createAuditLog({
      admin_id: userId,
      action: "ADOPTION_APPLY",
      target_type: "adoption_application",
      target_id: application.application_id,
      description: `User ${userId} applied for listing ${data.listing_id}`,
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
      a.application_id, a.status, a.created_at,
      l.listing_id,
      p.pet_id, p.name AS pet_name, p.breed, p.age, p.city, p.gender,
      pt.name AS pet_type
    FROM adoption_applications a
    JOIN adoption_listings l ON l.listing_id = a.listing_id
    JOIN pets p ON p.pet_id = l.pet_id
    LEFT JOIN pet_types pt ON pt.pet_type_id = p.pet_type_id
    WHERE a.user_id = $1
  `;

  const values = [user_id];

  if (tab === "ongoing") query += ` AND a.status = 'pending'`;
  else if (tab === "previous") query += ` AND a.status IN ('approved', 'rejected', 'cancelled')`;

  query += ` ORDER BY a.created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

/* ======================================================
   NGO - GET PETS WITH APPLICATION COUNTS
====================================================== */
const getNgoPetsWithApplications = async (userId) => {
  const ngoResult = await pool.query(
    `SELECT ngo_id FROM ngos WHERE user_id = $1`,
    [userId]
  );

  if (!ngoResult.rows.length) throw new Error("NGO not found");

  const ngoId = ngoResult.rows[0].ngo_id;

  const result = await pool.query(
    `SELECT
      p.pet_id, p.name, p.breed, p.age, p.city, p.status,
      (SELECT image_url FROM pet_images pi WHERE pi.pet_id = p.pet_id LIMIT 1) AS image_url,
      COUNT(a.application_id) AS total_applications,
      COUNT(CASE WHEN a.status = 'pending' THEN 1 END) AS pending_applications
     FROM pets p
     JOIN adoption_listings l ON l.pet_id = p.pet_id
     LEFT JOIN adoption_applications a ON a.listing_id = l.listing_id
     WHERE p.ngo_id = $1
     GROUP BY p.pet_id
     ORDER BY total_applications DESC`,
    [ngoId]
  );

  return result.rows;
};

/* ======================================================
   NGO - GET APPLICATIONS FOR ONE PET
====================================================== */
const getApplicationsForPet = async (userId, petId) => {
  const result = await pool.query(
    `SELECT
      a.application_id, a.status, a.created_at,
      u.user_id, u.name AS applicant_name, u.email, u.contact_number
     FROM adoption_applications a
     JOIN users u ON u.user_id = a.user_id
     JOIN adoption_listings l ON l.listing_id = a.listing_id
     JOIN pets p ON p.pet_id = l.pet_id
     JOIN ngos n ON n.ngo_id = p.ngo_id
     WHERE p.pet_id = $1 AND n.user_id = $2
     ORDER BY a.created_at DESC`,
    [petId, userId]
  );

  return result.rows;
};

const getApprovedApplicationForPet = async (userId, petId) => {
  const result = await pool.query(
    `SELECT
      a.application_id, a.status, a.created_at,
      u.user_id, u.name AS applicant_name, u.email, u.contact_number,
      ap.full_name, ap.preferred_contact_method, ap.house_type,
      ap.monthly_income_range, ap.monthly_budget_range, ap.pet_alone_hours,
      ap.has_children, ap.motivation, ap.other_pets,
      p.pet_id, p.name AS pet_name, p.breed, p.city
     FROM adoption_applications a
     JOIN adoption_application_profiles ap ON ap.application_id = a.application_id
     JOIN users u ON u.user_id = a.user_id
     JOIN adoption_listings l ON l.listing_id = a.listing_id
     JOIN pets p ON p.pet_id = l.pet_id
     JOIN ngos n ON n.ngo_id = p.ngo_id
     WHERE p.pet_id = $1 AND n.user_id = $2 AND a.status = 'approved'
     LIMIT 1`,
    [petId, userId]
  );
  if (!result.rows.length) throw new Error("No approved application found");
  return result.rows[0];
};
/* ======================================================
   NGO - GET SINGLE APPLICATION DETAILS
====================================================== */
const getApplicationDetails = async (userId, applicationId) => {
  const result = await pool.query(
    `SELECT
      a.application_id, a.status, a.created_at,
      u.user_id, u.name AS applicant_name, u.email, u.contact_number,
      ap.full_name, ap.preferred_contact_method, ap.house_type,
      ap.monthly_income_range, ap.monthly_budget_range, ap.pet_alone_hours,
      ap.has_children, ap.motivation, ap.other_pets,
      p.pet_id, p.name AS pet_name, p.breed, p.city
     FROM adoption_applications a
     JOIN adoption_application_profiles ap ON ap.application_id = a.application_id
     JOIN users u ON u.user_id = a.user_id
     JOIN adoption_listings l ON l.listing_id = a.listing_id
     JOIN pets p ON p.pet_id = l.pet_id
     JOIN ngos n ON n.ngo_id = p.ngo_id
     WHERE a.application_id = $1 AND n.user_id = $2`,
    [applicationId, userId]
  );

  if (!result.rows.length) throw new Error("Application not found");

  return result.rows[0];
};

/* ======================================================
   NGO - APPROVE APPLICATION
====================================================== */
const approveApplication = async (userId, applicationId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const applicationResult = await client.query(
      `SELECT
        a.application_id, a.user_id, a.listing_id,
        p.pet_id, p.name AS pet_name, n.ngo_id
       FROM adoption_applications a
       JOIN adoption_listings l ON l.listing_id = a.listing_id
       JOIN pets p ON p.pet_id = l.pet_id
       JOIN ngos n ON n.ngo_id = p.ngo_id
       WHERE a.application_id = $1 AND n.user_id = $2`,
      [applicationId, userId]
    );

    if (!applicationResult.rows.length)
      throw new Error("Application not found or unauthorized");

    const app = applicationResult.rows[0];

    await client.query(
      `UPDATE adoption_applications SET status = 'approved' WHERE application_id = $1`,
      [applicationId]
    );

    await client.query(
      `UPDATE adoption_applications
       SET status = 'rejected'
       WHERE listing_id = $1
       AND application_id != $2
       AND status = 'pending'`,
      [app.listing_id, applicationId]
    );

    await client.query(
      `UPDATE pets SET status = 'adopted' WHERE pet_id = $1`,
      [app.pet_id]
    );

    await client.query("COMMIT");

    await addReward({
      user_id: app.user_id,
      points: 50,
      source_type: "adoption",
      source_id: applicationId,
      reward_type: "adoption_success"
    });

    await createNotification({
      user_id: app.user_id,
      type: "adoption",
      message: `🎉 Your application for ${app.pet_name} was approved`,
      source_type: "adoption_application",
      source_id: applicationId
    });

    await auditService.createAuditLog({
      admin_id: userId,
      action: "APPLICATION_APPROVED",
      target_type: "adoption_application",
      target_id: applicationId,
      description: `NGO approved application ${applicationId}`
    });

    return { application_id: applicationId, status: "approved" };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/* ======================================================
   NGO - REJECT APPLICATION
====================================================== */
const rejectApplication = async (userId, applicationId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const applicationResult = await client.query(
      `SELECT
        a.application_id, a.user_id,
        p.name AS pet_name, n.ngo_id
       FROM adoption_applications a
       JOIN adoption_listings l ON l.listing_id = a.listing_id
       JOIN pets p ON p.pet_id = l.pet_id
       JOIN ngos n ON n.ngo_id = p.ngo_id
       WHERE a.application_id = $1 AND n.user_id = $2`,
      [applicationId, userId]
    );

    if (!applicationResult.rows.length)
      throw new Error("Application not found or unauthorized");

    const app = applicationResult.rows[0];

    await client.query(
      `UPDATE adoption_applications SET status = 'rejected' WHERE application_id = $1`,
      [applicationId]
    );

    await client.query("COMMIT");

    await createNotification({
      user_id: app.user_id,
      type: "adoption",
      message: `❌ Your application for ${app.pet_name} was rejected`,
      source_type: "adoption_application",
      source_id: applicationId
    });

    await auditService.createAuditLog({
      admin_id: userId,
      action: "APPLICATION_REJECTED",
      target_type: "adoption_application",
      target_id: applicationId,
      description: `NGO rejected application ${applicationId}`
    });

    return { application_id: applicationId, status: "rejected" };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getListingById = async (listingId) => {
  const result = await pool.query(
    `
    SELECT 
      l.listing_id,
      p.pet_id,
      p.name,
      p.breed,
      p.age,
      p.city,
      p.gender,
      pt.name AS pet_type,
      (
        SELECT json_agg(image_url)
        FROM pet_images pi
        WHERE pi.pet_id = p.pet_id
      ) AS images
    FROM adoption_listings l
    JOIN pets p ON p.pet_id = l.pet_id
    LEFT JOIN pet_types pt ON pt.pet_type_id = p.pet_type_id
    WHERE l.listing_id = $1
    `,
    [listingId]
  );

  return result.rows[0];
};

const cancelApplication = async (userId, applicationId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const check = await client.query(
      `SELECT a.application_id, a.user_id, a.status, p.name AS pet_name
       FROM adoption_applications a
       JOIN adoption_listings l ON l.listing_id = a.listing_id
       JOIN pets p ON p.pet_id = l.pet_id
       WHERE a.application_id = $1 AND a.user_id = $2`,
      [applicationId, userId]
    );

    if (!check.rows.length) throw new Error("Application not found");
    if (check.rows[0].status !== 'pending') throw new Error("Only pending applications can be cancelled");

    await client.query(
      `UPDATE adoption_applications SET status = 'cancelled' WHERE application_id = $1`,
      [applicationId]
    );

    await client.query("COMMIT");

    await createNotification({
      user_id: userId,
      type: "adoption",
      message: `Your application for ${check.rows[0].pet_name} has been cancelled`,
      source_type: "adoption_application",
      source_id: applicationId
    });

    return { application_id: applicationId, status: "cancelled" };

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
  getNgoPetsWithApplications,
  getApplicationsForPet,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
  getListingById,
  getApprovedApplicationForPet,
  cancelApplication,
};