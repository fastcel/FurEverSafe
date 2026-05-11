const express = require("express");
const router = express.Router();

const abuseController = require("../controllers/abuse.controller");
const {
  authenticate,
  authorizeRoles
} = require("../middlewares/auth.middleware");


/* =========================
   SUBMIT REPORT
========================= */
router.post(
  "/report",
  authenticate,
  abuseController.submitReport
);

/* =========================
   GET MY REPORTS
========================= */
router.get(
  "/my-reports",
  authenticate,
  abuseController.getMyReports
);

/* =========================
   GET REPORT DETAILS
========================= */
router.get(
  "/my-reports/:id",
  authenticate,
  abuseController.getReportDetails
);

/* =========================
   UPDATE REPORT STATUS
========================= */
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("ngo"),
  abuseController.updateStatus
);

module.exports = router;