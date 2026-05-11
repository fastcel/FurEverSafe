const { pool } = require("../db");
const { createNotification } = require("./notification.service");
const { addReward } = require("./reward.service");


const submitReport = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const locationResult = await client.query(
      `
      INSERT INTO locations (latitude, longitude, address)
      VALUES ($1, $2, $3)
      RETURNING location_id
      `,
      [data.latitude, data.longitude, data.address]
    );

    const location_id = locationResult.rows[0].location_id;

    const trackingId = "TRK-" + Date.now();

    const reportResult = await client.query(
      `
      INSERT INTO abuse_reports
      (user_id, location_id, description, abuse_datetime, severity, pet_type_id, tracking_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        data.user_id,
        location_id,
        data.description,
        data.abuse_datetime,
        data.severity,
        data.pet_type_id,
        trackingId
      ]
    );

    const report = reportResult.rows[0];

    if (data.images?.length) {
      for (const img of data.images) {
        await client.query(
          `
          INSERT INTO report_images (report_id, image_url)
          VALUES ($1, $2)
          `,
          [report.report_id, img]
        );
      }
    }

    await client.query("COMMIT");

    // SIDE EFFECTS (AFTER COMMIT)

    await addReward({
      user_id: data.user_id,
      points: 30,
      source_type: "abuse_report",
      source_id: report.report_id
    });

    await createNotification({
      user_id: data.user_id,
      type: "abuse_report",
      message: `Your abuse report (${trackingId}) has been submitted`,
      source_type: "abuse_report",
      source_id: report.report_id
    });

    return report;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};



const getUserReports = async (user_id) => {
  const result = await pool.query(
    `
    SELECT 
      report_id,
      tracking_id,
      status,
      created_at,
      abuse_datetime,
      severity
    FROM abuse_reports
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [user_id]
  );

  return result.rows;
};


const getReportById = async (report_id, user_id) => {
  const reportResult = await pool.query(
    `
    SELECT 
      r.*,
      l.latitude,
      l.longitude,
      l.address,
      pt.name AS pet_type
    FROM abuse_reports r
    LEFT JOIN locations l ON l.location_id = r.location_id
    LEFT JOIN pet_types pt ON pt.pet_type_id = r.pet_type_id
    WHERE r.report_id = $1 AND r.user_id = $2
    `,
    [report_id, user_id]
  );

  if (!reportResult.rows.length) {
    throw new Error("Report not found");
  }

  const report = reportResult.rows[0];

  const imagesResult = await pool.query(
    `
    SELECT image_url
    FROM report_images
    WHERE report_id = $1
    `,
    [report_id]
  );

  return {
    ...report,
    images: imagesResult.rows.map(i => i.image_url)
  };
};

const getNgoReports = async (tab) => {

  let query = `
    SELECT
      ar.report_id,
      ar.tracking_id,
      ar.description,
      ar.status,
      ar.created_at,
      ar.abuse_datetime,
      ar.severity,

      pt.pet_type_id,
      pt.name AS pet_type,

      l.location_id,
      l.city,
      l.address,

      u.user_id,
      u.name AS reporter_name,
      u.email AS reporter_email,

      (
        SELECT image_url
        FROM report_images ri
        WHERE ri.report_id = ar.report_id
        LIMIT 1
      ) AS image_url

    FROM abuse_reports ar

    LEFT JOIN users u
      ON u.user_id = ar.user_id

    LEFT JOIN pet_types pt
      ON pt.pet_type_id = ar.pet_type_id

    LEFT JOIN locations l
      ON l.location_id = ar.location_id

    WHERE 1=1
  `;

  /* =========================================
     FILTERS
  ========================================= */

  if (tab === "current") {
    query += `
      AND ar.status IN ('pending', 'under_review')
    `;
  }

  else if (tab === "previous") {
    query += `
      AND ar.status IN ('action_taken', 'rejected')
    `;
  }

  query += `
    ORDER BY ar.created_at DESC
  `;

  const result = await pool.query(query);

  return result.rows;
};

/* =========================================
   GET SINGLE REPORT DETAILS
========================================= */
const getReportByIdNgo = async (reportId) => {

  const result = await pool.query(
    `
    SELECT
      ar.report_id,
      ar.tracking_id,
      ar.description,
      ar.status,
      ar.created_at,
      ar.abuse_datetime,
      ar.severity,

      pt.pet_type_id,
      pt.name AS pet_type,

      l.location_id,
      l.city,
      l.address,

      u.user_id,
      u.name AS reporter_name,
      u.email AS reporter_email,
      u.contact_number,

      (
        SELECT json_agg(image_url)
        FROM report_images ri
        WHERE ri.report_id = ar.report_id
      ) AS images

    FROM abuse_reports ar

    LEFT JOIN users u
      ON u.user_id = ar.user_id

    LEFT JOIN pet_types pt
      ON pt.pet_type_id = ar.pet_type_id

    LEFT JOIN locations l
      ON l.location_id = ar.location_id

    WHERE ar.report_id = $1
    `,
    [reportId]
  );

  if (result.rows.length === 0) {
    throw new Error("Report not found");
  }

  return result.rows[0];
};

/* =========================================
   ACCEPT CASE
========================================= */
const acceptCase = async (reportId, ngoUserId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // verify report exists
    const reportCheck = await client.query(
      `
      SELECT report_id, user_id, tracking_id, status
      FROM abuse_reports
      WHERE report_id = $1
      `,
      [reportId]
    );

    if (reportCheck.rows.length === 0) {
      throw new Error("Report not found");
    }

    const report = reportCheck.rows[0];

    if (
      report.status === "action_taken" ||
      report.status === "rejected"
    ) {
      throw new Error("Case already finalized");
    }

    // update status
    const result = await client.query(
      `
      UPDATE abuse_reports
      SET
        status = 'action_taken'
      WHERE report_id = $1
      RETURNING *
      `,
      [reportId]
    );

    await client.query("COMMIT");

    // notification
    await createNotification({
      user_id: report.user_id,
      type: "abuse_report",
      message: `✅ Action has been taken on your abuse report (${report.tracking_id})`,
      source_type: "abuse_report",
      source_id: reportId
    });

    return result.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/* =========================================
   DISMISS CASE
========================================= */
const dismissCase = async (reportId, ngoUserId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // verify report exists
    const reportCheck = await client.query(
      `
      SELECT report_id, user_id, tracking_id, status
      FROM abuse_reports
      WHERE report_id = $1
      `,
      [reportId]
    );

    if (reportCheck.rows.length === 0) {
      throw new Error("Report not found");
    }

    const report = reportCheck.rows[0];

    if (
      report.status === "action_taken" ||
      report.status === "rejected"
    ) {
      throw new Error("Case already finalized");
    }

    // update
    const result = await client.query(
      `
      UPDATE abuse_reports
      SET
        status = 'rejected'
      WHERE report_id = $1
      RETURNING *
      `,
      [reportId]
    );

    await client.query("COMMIT");

    // notification
    await createNotification({
      user_id: report.user_id,
      type: "abuse_report",
      message: `❌ Your abuse report (${report.tracking_id}) was dismissed`,
      source_type: "abuse_report",
      source_id: reportId
    });

    return result.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  submitReport,
  getUserReports,
  getReportById,
  getNgoReports,
  getReportByIdNgo,
  acceptCase,
  dismissCase,
};