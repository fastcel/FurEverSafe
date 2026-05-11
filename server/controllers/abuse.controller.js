const abuseService = require("../services/abuse.service");

/* =========================
   SUBMIT ABUSE REPORT
========================= */
const submitReport = async (req, res) => {
  try {
    const result = await abuseService.submitReport(req.body);

    res.status(201).json({
      message: "Report submitted successfully",
      report: result
    });

  } catch (err) {
    console.log("🔥 ABUSE ERROR:", err);

    res.status(500).json({
      error: "Failed to submit report"
    });
  }
};

module.exports = {
  submitReport
};