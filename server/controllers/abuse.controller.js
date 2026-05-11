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

const getNgoReports = async (req, res) => {
  try {
    const reports = await abuseService.getNgoReports(
      req.query.tab
    );

    return res.status(200).json({
      message: "Reports fetched successfully",
      reports,
    });

  } catch (err) {
    console.log("🔥 NGO REPORTS ERROR:", err.message);

    return res.status(500).json({
      error: "Failed to fetch reports",
    });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await abuseService.getReportByIdNgo(
      req.params.id
    );

    return res.status(200).json({
      message: "Report fetched successfully",
      report,
    });

  } catch (err) {
    console.log("🔥 REPORT DETAILS ERROR:", err.message);

    return res.status(500).json({
      error: err.message || "Failed to fetch report",
    });
  }
};

/* =========================
   ACCEPT CASE
========================= */
const acceptCase = async (req, res) => {
  try {
    const result = await abuseService.acceptCase(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      message: "Case marked as action taken",
      report: result,
    });

  } catch (err) {
    console.log("🔥 ACCEPT CASE ERROR:", err.message);

    return res.status(500).json({
      error: err.message || "Failed to accept case",
    });
  }
};

/* =========================
   DISMISS CASE
========================= */
const dismissCase = async (req, res) => {
  try {
    const result = await abuseService.dismissCase(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      message: "Case dismissed successfully",
      report: result,
    });

  } catch (err) {
    console.log("🔥 DISMISS CASE ERROR:", err.message);

    return res.status(500).json({
      error: err.message || "Failed to dismiss case",
    });
  }
};

module.exports = {
  submitReport,
  getMyReports,
  getReportDetails,
  getNgoReports,
  getReportById,
  acceptCase,
  dismissCase,
};