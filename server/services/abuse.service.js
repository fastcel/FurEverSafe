const { pool } = require("../db");
const { createNotification } = require("./notification.service");

/* ======================================================
   SUBMIT ABUSE REPORT
====================================================== */
const submitReport = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // STEP 1: CREATE LOCATION
    const locationResult = await client.query(
      `
      INSERT INTO locations (latitude, longitude, address)
      VALUES ($1, $2, $3)
      RETURNING location_id
      `,
      [data.latitude, data.longitude, data.address]
    );

    const location_id = locationResult.rows[0].location_id;

    // STEP 2: CREATE REPORT
    const trackingId = "TRK-" + Date.now();

    const reportResult = await client.query(
      `
      INSERT INTO abuse_reports
      (
        user_id,
        location_id,
        description,
        abuse_datetime,
        severity,
        pet_type_id,
        tracking_id
      )
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

    // STEP 3: IMAGES
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

    // 🔥 NOTIFICATION (after commit)
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

/* ======================================================
   UPDATE REPORT STATUS (NGO)
====================================================== */
const updateReportStatus = async (report_id, status) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      UPDATE abuse_reports
      SET status = $1
      WHERE report_id = $2
      RETURNING user_id, tracking_id
      `,
      [status, report_id]
    );

    if (result.rows.length === 0) {
      throw new Error("Invalid report_id");
    }

    const data = result.rows[0];

    let message = "";

    if (status === "under_review") {
      message = `📋 Your abuse report (${data.tracking_id}) is under review`;
    } else if (status === "action_taken") {
      message = `✅ Action has been taken on your abuse report (${data.tracking_id})`;
    } else if (status === "rejected") {
      message = `❌ Your abuse report (${data.tracking_id}) was rejected`;
    } else {
      throw new Error("Invalid status value");
    }

    await client.query("COMMIT");

    // 🔥 NOTIFICATION (after commit)
    await createNotification({
      user_id: data.user_id,
      type: "abuse_report",
      message,
      source_type: "abuse_report",
      source_id: report_id
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
  updateReportStatus
};