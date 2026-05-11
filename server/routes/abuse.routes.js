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

router.get(
  "/ngo",
  authenticate,
  authorizeRoles("ngo"),
  abuseController.getNgoReports
);

router.get(
  "/ngo/:id",
  authenticate,
  authorizeRoles("ngo"),
  abuseController.getReportById
);

router.patch(
  "/ngo/:id/accept",
  authenticate,
  authorizeRoles("ngo"),
  abuseController.acceptCase
);

router.patch(
  "/ngo/:id/dismiss",
  authenticate,
  authorizeRoles("ngo"),
  abuseController.dismissCase
);

module.exports = router;