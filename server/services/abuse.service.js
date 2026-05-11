const { pool } = require("../db");

const submitReport = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =========================
       STEP 1: CREATE LOCATION
    ========================= */

    const locationResult = await client.query(
      `
      INSERT INTO locations (latitude, longitude, address)
      VALUES ($1, $2, $3)
      RETURNING location_id
      `,
      [
        data.latitude,
        data.longitude,
        data.address
      ]
    );

    const location_id = locationResult.rows[0].location_id;

    /* =========================
       STEP 2: CREATE REPORT
    ========================= */

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

    /* =========================
       STEP 3: IMAGES
    ========================= */

    if (data.images?.length) {
      for (let img of data.images) {
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

    return report;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  submitReport
};