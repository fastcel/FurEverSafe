const express = require("express");
const router = express.Router();

const milestoneController = require("../controllers/milestone.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/", authenticate, milestoneController.getMilestones);

module.exports = router;