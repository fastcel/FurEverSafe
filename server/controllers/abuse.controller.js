const abuseService = require("../services/abuse.service");

/* =========================
   SUBMIT ABUSE REPORT
========================= */
const submitReport = async (req, res) => {
  try {
    const result = await abuseService.submitReport({
      ...req.body,
      user_id: req.user.id
    });

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

/* =========================
   UPDATE STATUS
========================= */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await abuseService.updateReportStatus(
      id,
      status
    );

    res.json({
      message: "Status updated",
      data: result
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Failed to update report status"
    });
  }
};

/* =========================
   GET MY REPORTS
========================= */
const getMyReports = async (req, res) => {
  try {
    const user_id = req.user.id;

    const data = await abuseService.getUserReports(user_id);

    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/* =========================
   GET REPORT DETAILS
========================= */
const getReportDetails = async (req, res) => {
  try {
    const user_id = req.user.id;
    const report_id = req.params.id;

    const data = await abuseService.getReportById(
      report_id,
      user_id
    );

    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  submitReport,
  updateStatus,
  getMyReports,
  getReportDetails
};