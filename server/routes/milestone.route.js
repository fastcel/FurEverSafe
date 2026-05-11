const express = require("express");
const router = express.Router();

const milestoneController = require("../controllers/milestone.controller");

router.get("/", milestoneController.getMilestones);

module.exports = router;