const express = require("express");
const router = express.Router();

const abuseController = require("../controllers/abuse.controller");

// POST /api/abuse/report
router.post("/report", abuseController.submitReport);

router.patch(
  "/:id/status",
  abuseController.updateStatus
);

module.exports = router;