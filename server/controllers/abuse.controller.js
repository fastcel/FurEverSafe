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


const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await abuseService.updateReportStatus(id, status);

    res.json({
      message: "Status updated",
      data: result
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update report status" });
  }
};


const getMyReports = async (req, res) => {
  try {
    const user_id = 1; // or hardcoded for now
    const data = await abuseService.getUserReports(user_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReportDetails = async (req, res) => {
  try {
    const user_id = 1;
    const report_id = req.params.id;

    const data = await abuseService.getReportById(report_id, user_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  submitReport,
  updateStatus,
  getMyReports,
  getReportDetails
};